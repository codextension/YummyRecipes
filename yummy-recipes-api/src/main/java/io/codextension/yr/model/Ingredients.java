package io.codextension.yr.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import org.neo4j.ogm.annotation.GraphId;
import org.neo4j.ogm.annotation.NodeEntity;

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
    private String name;
    private IngredientType type;
    private String picturePath;

    public Ingredients() {
    }

    public Ingredients(String name, IngredientType type, String picturePath) {
        this.name = name;
        this.picturePath = picturePath;
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

    public String getPicturePath() {
        return picturePath;
    }

    public void setPicturePath(String picturePath) {
        this.picturePath = picturePath;
    }
}
