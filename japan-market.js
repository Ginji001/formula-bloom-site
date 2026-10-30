// 化粧品は既知のINCIから日本語表示名へ変換、医薬部外品は実際の日本語の表示を維持。
import {ingredientJapanese} from './japanese.js';
import {isJapaneseIngredientText} from './japan-market-policy.js';
export function japaneseIngredientLabel(name,{kind='cosmetic'}={}){
 const original=String(name||'').trim();
 if(!original)return null;
 if(isJapaneseIngredientText(original))return original;
 if(kind==='quasi')return null;
 return ingredientJapanese(original);
}
