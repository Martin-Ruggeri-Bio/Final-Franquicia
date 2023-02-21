package ar.edu.um.franquicia.service;

import ar.edu.um.franquicia.domain.Menu;
import ar.edu.um.franquicia.repository.MenuRepository;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Menu}.
 */
@Service
@Transactional
public class MenuService {

    private final Logger log = LoggerFactory.getLogger(MenuService.class);

    private final MenuRepository menuRepository;

    public MenuService(MenuRepository menuRepository) {
        this.menuRepository = menuRepository;
    }

    /**
     * Save a menu.
     *
     * @param menu the entity to save.
     * @return the persisted entity.
     */
    public Menu save(Menu menu) {
        log.debug("Request to save Menu : {}", menu);
        return menuRepository.save(menu);
    }

    /**
     * Update a menu.
     *
     * @param menu the entity to save.
     * @return the persisted entity.
     */
    public Menu update(Menu menu) {
        log.debug("Request to save Menu : {}", menu);
        return menuRepository.save(menu);
    }

    /**
     * Partially update a menu.
     *
     * @param menu the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Menu> partialUpdate(Menu menu) {
        log.debug("Request to partially update Menu : {}", menu);

        return menuRepository
            .findById(menu.getId())
            .map(existingMenu -> {
                if (menu.getNombre() != null) {
                    existingMenu.setNombre(menu.getNombre());
                }
                if (menu.getDescripcion() != null) {
                    existingMenu.setDescripcion(menu.getDescripcion());
                }
                if (menu.getPrecio() != null) {
                    existingMenu.setPrecio(menu.getPrecio());
                }
                if (menu.getUrlImagen() != null) {
                    existingMenu.setUrlImagen(menu.getUrlImagen());
                }
                if (menu.getActivo() != null) {
                    existingMenu.setActivo(menu.getActivo());
                }
                if (menu.getCreado() != null) {
                    existingMenu.setCreado(menu.getCreado());
                }
                if (menu.getActualizado() != null) {
                    existingMenu.setActualizado(menu.getActualizado());
                }

                return existingMenu;
            })
            .map(menuRepository::save);
    }

    /**
     * Get all the menus.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Menu> findAll() {
        log.debug("Request to get all Menus");
        return menuRepository.findAll();
    }

    /**
     * Get one menu by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Menu> findOne(Long id) {
        log.debug("Request to get Menu : {}", id);
        return menuRepository.findById(id);
    }

    /**
     * Delete the menu by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Menu : {}", id);
        menuRepository.deleteById(id);
    }
}
