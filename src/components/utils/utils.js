import { Constants } from './constants';
import { Order } from '../standings/order';

export const Util = {

	/**
	 * Number conversion from a base to another
	 */
	ConvertBase: num => {
		return {
			from : function (baseFrom) {
				return {
					to : function (baseTo) {
						return parseInt(num, baseFrom).toString(baseTo);
					}
				};
			}
		};
	},

	/**
	 * Fill with zeros to the left until the indicated size
	 */
	fillZeros: (num, size) => {
		var s = String(num);
		while (s.length < (size || 2)) {s = "0" + s;}
		return s;
	},

	/**
	 * Makes a copy of an element 
	 */
	copy: element => {
		return JSON.parse(JSON.stringify(element))
	},
	
	toStr: (array, ordenado) => {
		if(ordenado) {
			array.sort();
		}
		return array.join("-");
	},
	
	toArr: (str) => {
		return str.split("-");
	},

	/**
	 * Return all the possible combinations of 2 elements from a given array
	 */
	getCombinations: (array) => {
		return array.reduce( (acc, v, i) =>
			acc.concat(array.slice(i+1).map( w => [v, w] )),
		[]);
	},
	
	getElement: (tipo, item) => {
		var element;
			switch(tipo) {
				case Constants.SCORE:
					element = (item.wins !== undefined) ? item.wins : item.points
					break;
				case Constants.FAVOR:
					element = (item.pointsFavor !== undefined) ? item.pointsFavor : item.goalsFavor;
					break;
				case Constants.AGAINST:
					element = (item.pointsAgainst !== undefined) ? item.pointsAgainst : item.goalsAgainst;
					break;
				case Constants.DIFFERENCE:
					element = item.difference;
					break;
				default:
					break;
			}
		return element;
	},

  isCompetitionRecursive: (competition) => {
    const recursive = [Constants.ACB, Constants.EUROLEAGUE, Constants.LEB]
    return recursive.includes(competition)
  },

  getOrderByCompetition: (competition) => {
    return (Util.isCompetitionRecursive(competition))?Order.finalRecursive:Order.finalNotRecursive
  },

  getMinLengthArrayOfArray: (array) => {
    let minLength
    array.forEach(item => {
      if (minLength === undefined || item.length < minLength) {
        minLength = item.length
      }
    })
    return minLength
  },

  filterMatchFromCombination(item, match) {
    return (item.local.abr === match.team1.abr && item.visit.abr === match.team2.abr) ||
      (item.local.abr === match.team2.abr && item.visit.abr === match.team1.abr)
  },

  isSameOrder(standings1, standings2){
    if (standings1.length !== standings2.length){
      return false
    }
    let sameOrder = true
    standings1.forEach((position,i) =>{
      if (position.abr !== standings2[i].abr) {
        sameOrder = false
      }
    })
    return sameOrder
  },

  existsSameOrder(standings, standingsList){
    let sameOrder = false
    if (standingsList.length > 0) {
      standingsList.forEach(positions => {
        if (Util.isSameOrder(standings, positions)){
          sameOrder = true
        }
      })
      return sameOrder
    } else {
      return false
    }
  }

};

