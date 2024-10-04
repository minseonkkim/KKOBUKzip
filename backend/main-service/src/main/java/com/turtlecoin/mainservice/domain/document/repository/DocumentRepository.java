package com.turtlecoin.mainservice.domain.document.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.turtlecoin.mainservice.domain.document.entity.Document;
import com.turtlecoin.mainservice.domain.document.entity.Progress;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
	@Query("select d from Document d where d.documentHash = :documentHash and d.turtleUUID = :turtleUUID")
	public Optional<Document> findByDocumentHashAndTurtleUUID(@Param("documentHash") String documentHash, @Param("turtleUUID") String turtleUUID);

	@Query("select d from Document d where d.progress = :progress and d.applicant is not null")
	public List<Document> findAllByProgress(@Param("progress") Progress progress, Pageable pageable);
}
