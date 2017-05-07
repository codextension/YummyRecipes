package io.codextension.yr.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import org.neo4j.ogm.annotation.GraphId;
import org.neo4j.ogm.annotation.NodeEntity;
import org.neo4j.ogm.annotation.Property;

import javax.validation.constraints.NotNull;
import java.io.Serializable;

/**
 * Created by elie on 07.05.17.
 */
@NodeEntity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Ingredients implements Serializable {

    @GraphId
    private Long id;
    @NotNull
    @Property(name = "name")
    private String name;
    private IngredientType type;

    public Ingredients() {
    }

    public Ingredients(String name, IngredientType type) {
        this.name = name;
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public IngredientType getType() {
        return type;
    }

    public void setType(IngredientType type) {
        this.type = type;
    }

    public long getId() {
        return id;
    }
}
