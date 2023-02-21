package ar.edu.um.franquicia.domain;

import static org.assertj.core.api.Assertions.assertThat;

import ar.edu.um.franquicia.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DetailsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Details.class);
        Details details1 = new Details();
        details1.setId(1L);
        Details details2 = new Details();
        details2.setId(details1.getId());
        assertThat(details1).isEqualTo(details2);
        details2.setId(2L);
        assertThat(details1).isNotEqualTo(details2);
        details1.setId(null);
        assertThat(details1).isNotEqualTo(details2);
    }
}
