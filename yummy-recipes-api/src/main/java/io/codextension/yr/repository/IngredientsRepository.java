package io.codextension.yr.repository;

import io.codextension.yr.model.Ingredients;
import org.springframework.data.neo4j.repository.GraphRepository;

import java.util.List;

/**
 * Created by elie on 07.05.17.
 */
public interface IngredientsRepository extends GraphRepository<Ingredients> {

    List<Ingredients> findByName(String name);
}
