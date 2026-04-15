package com.funstack.backend.repository;

import com.funstack.backend.model.GameResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameResultRepository extends JpaRepository<GameResult, Long> {
    List<GameResult> findByUserIdOrderByTimestampDesc(Long userId);
    List<GameResult> findByGameTypeOrderByTimestampDesc(String gameType);
}
