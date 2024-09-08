package com.turtlecoin.mainservice.global.scheduler;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

@Configuration
@EnableScheduling  // 스케줄링 활성화
public class DocumentBatchScheduler {

    @Autowired
    @Qualifier("metaJobLauncher")
    private JobLauncher jobLauncher;

    @Autowired
    @Qualifier("DocUpdateJob")
    private Job updateDocumentJob;  // 실행할 Job 주입

    @Scheduled(fixedDelay = 60000)  // 1시간 간격으로 실행 (밀리초 단위)
    public void runUpdateDocumentJob() throws Exception {
        // 매번 실행되는 배치마다 유일성을 보장하기 위해 ( 중복 실행 방지 ) 시간을 입력해준다.
        JobParameters jobParameters = new JobParametersBuilder()
                .addLong("time", System.currentTimeMillis())  // 매번 새로운 파라미터 생성
                .toJobParameters();

        jobLauncher.run(updateDocumentJob, jobParameters);  // Job 실행
    }
}