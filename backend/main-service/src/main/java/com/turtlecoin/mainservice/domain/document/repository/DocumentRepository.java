package com.turtlecoin.mainservice.domain.document.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.turtlecoin.mainservice.domain.document.entity.Document;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
	@Query("select d from Document d where d.documentHash = :documentHash and d.turtleUUID = :turtleUUID")
	public Document findByDocumentHashAndTurtleUUID(@Param("documentHash") String documentHash, @Param("turtleUUID") String turtleUUID);
}
