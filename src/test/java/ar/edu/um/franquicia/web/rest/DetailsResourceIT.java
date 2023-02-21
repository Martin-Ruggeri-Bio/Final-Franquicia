package ar.edu.um.franquicia.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import ar.edu.um.franquicia.IntegrationTest;
import ar.edu.um.franquicia.domain.Details;
import ar.edu.um.franquicia.repository.DetailsRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link DetailsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DetailsResourceIT {

    private static final Integer DEFAULT_AMOUNT = 1;
    private static final Integer UPDATED_AMOUNT = 2;

    private static final String ENTITY_API_URL = "/api/details";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DetailsRepository detailsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDetailsMockMvc;

    private Details details;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Details createEntity(EntityManager em) {
        Details details = new Details().amount(DEFAULT_AMOUNT);
        return details;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Details createUpdatedEntity(EntityManager em) {
        Details details = new Details().amount(UPDATED_AMOUNT);
        return details;
    }

    @BeforeEach
    public void initTest() {
        details = createEntity(em);
    }

    @Test
    @Transactional
    void createDetails() throws Exception {
        int databaseSizeBeforeCreate = detailsRepository.findAll().size();
        // Create the Details
        restDetailsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(details)))
            .andExpect(status().isCreated());

        // Validate the Details in the database
        List<Details> detailsList = detailsRepository.findAll();
        assertThat(detailsList).hasSize(databaseSizeBeforeCreate + 1);
        Details testDetails = detailsList.get(detailsList.size() - 1);
        assertThat(testDetails.getAmount()).isEqualTo(DEFAULT_AMOUNT);
    }

    @Test
    @Transactional
    void createDetailsWithExistingId() throws Exception {
        // Create the Details with an existing ID
        details.setId(1L);

        int databaseSizeBeforeCreate = detailsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDetailsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(details)))
            .andExpect(status().isBadRequest());

        // Validate the Details in the database
        List<Details> detailsList = detailsRepository.findAll();
        assertThat(detailsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllDetails() throws Exception {
        // Initialize the database
        detailsRepository.saveAndFlush(details);

        // Get all the detailsList
        restDetailsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(details.getId().intValue())))
            .andExpect(jsonPath("$.[*].amount").value(hasItem(DEFAULT_AMOUNT)));
    }

    @Test
    @Transactional
    void getDetails() throws Exception {
        // Initialize the database
        detailsRepository.saveAndFlush(details);

        // Get the details
        restDetailsMockMvc
            .perform(get(ENTITY_API_URL_ID, details.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(details.getId().intValue()))
            .andExpect(jsonPath("$.amount").value(DEFAULT_AMOUNT));
    }

    @Test
    @Transactional
    void getNonExistingDetails() throws Exception {
        // Get the details
        restDetailsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewDetails() throws Exception {
        // Initialize the database
        detailsRepository.saveAndFlush(details);

        int databaseSizeBeforeUpdate = detailsRepository.findAll().size();

        // Update the details
        Details updatedDetails = detailsRepository.findById(details.getId()).get();
        // Disconnect from session so that the updates on updatedDetails are not directly saved in db
        em.detach(updatedDetails);
        updatedDetails.amount(UPDATED_AMOUNT);

        restDetailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDetails.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDetails))
            )
            .andExpect(status().isOk());

        // Validate the Details in the database
        List<Details> detailsList = detailsRepository.findAll();
        assertThat(detailsList).hasSize(databaseSizeBeforeUpdate);
        Details testDetails = detailsList.get(detailsList.size() - 1);
        assertThat(testDetails.getAmount()).isEqualTo(UPDATED_AMOUNT);
    }

    @Test
    @Transactional
    void putNonExistingDetails() throws Exception {
        int databaseSizeBeforeUpdate = detailsRepository.findAll().size();
        details.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDetailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, details.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(details))
            )
            .andExpect(status().isBadRequest());

        // Validate the Details in the database
        List<Details> detailsList = detailsRepository.findAll();
        assertThat(detailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDetails() throws Exception {
        int databaseSizeBeforeUpdate = detailsRepository.findAll().size();
        details.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDetailsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(details))
            )
            .andExpect(status().isBadRequest());

        // Validate the Details in the database
        List<Details> detailsList = detailsRepository.findAll();
        assertThat(detailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDetails() throws Exception {
        int databaseSizeBeforeUpdate = detailsRepository.findAll().size();
        details.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDetailsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(details)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Details in the database
        List<Details> detailsList = detailsRepository.findAll();
        assertThat(detailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDetailsWithPatch() throws Exception {
        // Initialize the database
        detailsRepository.saveAndFlush(details);

        int databaseSizeBeforeUpdate = detailsRepository.findAll().size();

        // Update the details using partial update
        Details partialUpdatedDetails = new Details();
        partialUpdatedDetails.setId(details.getId());

        partialUpdatedDetails.amount(UPDATED_AMOUNT);

        restDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDetails.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDetails))
            )
            .andExpect(status().isOk());

        // Validate the Details in the database
        List<Details> detailsList = detailsRepository.findAll();
        assertThat(detailsList).hasSize(databaseSizeBeforeUpdate);
        Details testDetails = detailsList.get(detailsList.size() - 1);
        assertThat(testDetails.getAmount()).isEqualTo(UPDATED_AMOUNT);
    }

    @Test
    @Transactional
    void fullUpdateDetailsWithPatch() throws Exception {
        // Initialize the database
        detailsRepository.saveAndFlush(details);

        int databaseSizeBeforeUpdate = detailsRepository.findAll().size();

        // Update the details using partial update
        Details partialUpdatedDetails = new Details();
        partialUpdatedDetails.setId(details.getId());

        partialUpdatedDetails.amount(UPDATED_AMOUNT);

        restDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDetails.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDetails))
            )
            .andExpect(status().isOk());

        // Validate the Details in the database
        List<Details> detailsList = detailsRepository.findAll();
        assertThat(detailsList).hasSize(databaseSizeBeforeUpdate);
        Details testDetails = detailsList.get(detailsList.size() - 1);
        assertThat(testDetails.getAmount()).isEqualTo(UPDATED_AMOUNT);
    }

    @Test
    @Transactional
    void patchNonExistingDetails() throws Exception {
        int databaseSizeBeforeUpdate = detailsRepository.findAll().size();
        details.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, details.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(details))
            )
            .andExpect(status().isBadRequest());

        // Validate the Details in the database
        List<Details> detailsList = detailsRepository.findAll();
        assertThat(detailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDetails() throws Exception {
        int databaseSizeBeforeUpdate = detailsRepository.findAll().size();
        details.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDetailsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(details))
            )
            .andExpect(status().isBadRequest());

        // Validate the Details in the database
        List<Details> detailsList = detailsRepository.findAll();
        assertThat(detailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDetails() throws Exception {
        int databaseSizeBeforeUpdate = detailsRepository.findAll().size();
        details.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDetailsMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(details)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Details in the database
        List<Details> detailsList = detailsRepository.findAll();
        assertThat(detailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDetails() throws Exception {
        // Initialize the database
        detailsRepository.saveAndFlush(details);

        int databaseSizeBeforeDelete = detailsRepository.findAll().size();

        // Delete the details
        restDetailsMockMvc
            .perform(delete(ENTITY_API_URL_ID, details.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Details> detailsList = detailsRepository.findAll();
        assertThat(detailsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
