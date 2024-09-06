package com.turtlecoin.mainservice.global.config;

import java.util.Properties;

import javax.sql.DataSource;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import jakarta.persistence.EntityManagerFactory;

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
	entityManagerFactoryRef = "metaEntityManagerFactory",
	transactionManagerRef = "metaTransactionManager")
public class MetaDBConfig {
	@Bean(name = "metaDataSource")
	@ConfigurationProperties(prefix = "spring.datasource.meta")
	public DataSource metaDataSource() {
		return DataSourceBuilder.create().build();
	}

	@Bean(name = "metaEntityManagerFactory")
	public LocalContainerEntityManagerFactoryBean metaEntityManagerFactory() {
		LocalContainerEntityManagerFactoryBean factory = new LocalContainerEntityManagerFactoryBean();
		factory.setDataSource(metaDataSource());
		factory.setPackagesToScan("com.example.batchweb3j.global.config"); // 엔티티 패키지 경로
		factory.setJpaVendorAdapter(new HibernateJpaVendorAdapter());
		Properties jpaProperties = new Properties();
		jpaProperties.put("hibernate.dialect", "org.hibernate.dialect.MySQLDialect");
		jpaProperties.put("hibernate.hbm2ddl.auto", "create");
		factory.setJpaProperties(jpaProperties);
		return factory;
	}

	@Bean(name = "metaTransactionManager")
	public PlatformTransactionManager metaTransactionManager(EntityManagerFactory metaEntityManagerFactory) {
		return new JpaTransactionManager(metaEntityManagerFactory);
	}
}
