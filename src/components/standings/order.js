import { Constants } from "../utils/constants"
import { Util } from "../utils/utils"


export const Order = {

	/**
	 * Set initial order between 2 elements
	 */
  initial: (a,b) => {
		return Util.getElement(Constants.SCORE, b) - Util.getElement(Constants.SCORE, a)
	},

	/**
	 * Set particular order between 2 elements
	 */
	particular: (a,b,i,stop) => {
		let particularA = a.particular[i];
		let particularB = b.particular[i];
    let difference = 0
		if (particularA !== undefined && particularB !== undefined){
      difference = Util.getElement(Constants.SCORE, particularB) - Util.getElement(Constants.SCORE, particularA);
      if (difference === 0) {
        if (!stop && i+1 < a.particular.length && i+1 < b.particular.length) {
          return Order.particular(a,b,i+1,stop)
        }
        let differenceA = Util.getElement(Constants.DIFFERENCE, particularA)
        let differenceB = Util.getElement(Constants.DIFFERENCE, particularB)
        if (differenceB === differenceA) {
          return Util.getElement(Constants.FAVOR, particularB) - Util.getElement(Constants.FAVOR, particularA);
        }
        return differenceB - differenceA;
      }
		} else {
			if (!particularA){
				console.error("[ERROR] - There is no particular average in the element");
				console.log({a})
			} else {
				console.error("[ERROR] - There is no particular average in the element");
				console.log({b})
			}
			return 0;
		}
		return difference;
	},
	
	/**
	 * Set final order between 2 elements
	 */
	finalRecursive: (a,b) => {
		
		var difference = Util.getElement(Constants.SCORE, b) - Util.getElement(Constants.SCORE, a);
		if (difference === 0) {
			return Order.particular(a,b,0,false);
		}
		return difference;
	},

  /**
	 * Set final order between 2 elements
	 */
	finalNotRecursive: (a,b) => {
		
		var difference = Util.getElement(Constants.SCORE, b) - Util.getElement(Constants.SCORE, a);
		if (difference === 0) {
			return Order.particular(a,b,0,true);
		}
		return difference;
	},
}