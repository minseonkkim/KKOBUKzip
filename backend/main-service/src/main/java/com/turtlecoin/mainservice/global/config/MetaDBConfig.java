package com.turtlecoin.mainservice.global.config;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.stream.Stream;

import javax.sql.DataSource;

import org.springframework.batch.core.DefaultJobKeyGenerator;
import org.springframework.batch.core.JobKeyGenerator;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.launch.support.TaskExecutorJobLauncher;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.repository.support.JobRepositoryFactoryBean;
import org.springframework.batch.item.database.support.DataFieldMaxValueIncrementerFactory;
import org.springframework.batch.support.DatabaseType;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.dao.DataAccessException;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.jdbc.core.*;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.jdbc.support.incrementer.DataFieldMaxValueIncrementer;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableTransactionManagement
public class MetaDBConfig {
	@Bean(name = "metaDataSource")
	@ConfigurationProperties(prefix = "spring.datasource.meta")
	public DataSource metaDataSource() {
		return DataSourceBuilder.create().build();
	}

	@Bean(name = "metaTransactionManager")
	public PlatformTransactionManager metaTransactionManager(@Qualifier("metaDataSource") DataSource metaDataSource) {
		return new DataSourceTransactionManager(metaDataSource);
	}

	@Bean(name = "metaJobRepository")
	public JobRepository jobRepository(@Qualifier("metaDataSource") DataSource metaDataSource, @Qualifier("metaTransactionManager") PlatformTransactionManager transactionManager) throws Exception {
		JobRepositoryFactoryBean factoryBean = new JobRepositoryFactoryBean();

		factoryBean.setDatabaseType(DatabaseType.MYSQL.getProductName());

		// 데이터 생성 시 트랜잭션 격리 레벨 설정 factoryBean.setIsolcationLevelForCreate("ISOLATION_REPEATABLE_READ");
		factoryBean.setDataSource(metaDataSource);

		factoryBean.setTransactionManager(transactionManager);

		// 스프링 컨테이너가 빈 정의로 직접 호출하지 않음. 개발자가 직접 호출해야 한다.
		factoryBean.afterPropertiesSet();
		return factoryBean.getObject();
	}

	@Bean(name = "metaJobLauncher")
	public JobLauncher jobLauncher(@Qualifier("metaJobRepository") JobRepository jobRepository) {
		TaskExecutorJobLauncher jobLauncher = new TaskExecutorJobLauncher();
		jobLauncher.setJobRepository(jobRepository);
		return jobLauncher;
	}
}
