package ar.edu.um.franquicia.repository;

import ar.edu.um.franquicia.domain.Details;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Details entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DetailsRepository extends JpaRepository<Details, Long> {}
