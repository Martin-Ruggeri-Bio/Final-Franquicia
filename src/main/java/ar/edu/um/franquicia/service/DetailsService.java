package ar.edu.um.franquicia.service;

import ar.edu.um.franquicia.domain.Details;
import ar.edu.um.franquicia.repository.DetailsRepository;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Details}.
 */
@Service
@Transactional
public class DetailsService {

    private final Logger log = LoggerFactory.getLogger(DetailsService.class);

    private final DetailsRepository detailsRepository;

    public DetailsService(DetailsRepository detailsRepository) {
        this.detailsRepository = detailsRepository;
    }

    /**
     * Save a details.
     *
     * @param details the entity to save.
     * @return the persisted entity.
     */
    public Details save(Details details) {
        log.debug("Request to save Details : {}", details);
        return detailsRepository.save(details);
    }

    /**
     * Update a details.
     *
     * @param details the entity to save.
     * @return the persisted entity.
     */
    public Details update(Details details) {
        log.debug("Request to save Details : {}", details);
        return detailsRepository.save(details);
    }

    /**
     * Partially update a details.
     *
     * @param details the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Details> partialUpdate(Details details) {
        log.debug("Request to partially update Details : {}", details);

        return detailsRepository
            .findById(details.getId())
            .map(existingDetails -> {
                if (details.getAmount() != null) {
                    existingDetails.setAmount(details.getAmount());
                }

                return existingDetails;
            })
            .map(detailsRepository::save);
    }

    /**
     * Get all the details.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Details> findAll() {
        log.debug("Request to get all Details");
        return detailsRepository.findAll();
    }

    /**
     * Get one details by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Details> findOne(Long id) {
        log.debug("Request to get Details : {}", id);
        return detailsRepository.findById(id);
    }

    /**
     * Delete the details by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Details : {}", id);
        detailsRepository.deleteById(id);
    }
}
