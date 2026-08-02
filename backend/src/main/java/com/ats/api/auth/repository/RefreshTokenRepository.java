package com.ats.api.auth.repository;

import com.ats.api.auth.entity.RefreshToken;
import com.ats.api.auth.entity.enums.RefreshTokenStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {

    Optional<RefreshToken> findByTokenHash(String tokenHash);

    List<RefreshToken> findAllByFamilyId(UUID familyId);

    @Modifying
    @Query("UPDATE RefreshToken r SET r.status = :status WHERE r.familyId = :familyId")
    int updateStatusByFamilyId(@Param("familyId") UUID familyId, @Param("status") RefreshTokenStatus status);

    @Modifying
    @Query("UPDATE RefreshToken r SET r.status = :status WHERE r.user.id = :userId")
    int updateStatusByUserId(@Param("userId") UUID userId, @Param("status") RefreshTokenStatus status);
}
