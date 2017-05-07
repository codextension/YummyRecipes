package io.codextension.yr.controller;

import io.codextension.yr.model.IngredientType;
import io.codextension.yr.model.Ingredients;
import io.codextension.yr.repository.IngredientsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.PostConstruct;

/**
 * Created by elie on 07.05.17.
 */
@RestController
@RequestMapping("/ingredient")
@CrossOrigin
public class IngredientsController {

    @Autowired
    private IngredientsRepository ingredientsRepository;

    @PostConstruct
    public void init() {
        ingredientsRepository.save(new Ingredients("Birne", IngredientType.FRUIT));
    }


    @RequestMapping("/all")
    public Iterable<Ingredients> all() {
        return ingredientsRepository.findAll();
    }
}
