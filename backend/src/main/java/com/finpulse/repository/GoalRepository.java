package com.finpulse.repository;

import com.finpulse.entity.Goal;
import com.finpulse.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GoalRepository extends JpaRepository<Goal, Long> {

    List<Goal> findByUserOrderByTargetDateAsc(User user);

    Optional<Goal> findByIdAndUser(Long id, User user);

    long countByUser(User user);
}