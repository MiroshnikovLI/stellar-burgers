import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAllIngredients } from '../slices/ingredientsSlice';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  const par = useParams();

  const ingredient = useSelector(selectAllIngredients);

  let ingredientData = null;

  ingredient.forEach((ele) => {
    if (ele._id === par.id) {
      ingredientData = ele;
    }
  });

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
