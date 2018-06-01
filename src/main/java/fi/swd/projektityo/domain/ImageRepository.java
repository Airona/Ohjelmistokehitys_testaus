package fi.swd.projektityo.domain;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RestResource;

@RestResource
public interface ImageRepository extends CrudRepository<Image, Long> {
//	List<Image> findByGame(@Param("games") String game);
}