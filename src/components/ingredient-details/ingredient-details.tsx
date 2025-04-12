import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { selectAllIngredients } from '../slices/ingredientsSlice';
import { useSelector } from '../../services/store';

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
