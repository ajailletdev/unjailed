export function multiWordFilter(filter: string[], toFilter: string[]): boolean {
    let isFound = true;
    if(filter.length > toFilter.length) isFound = false;
    filter.map(str => {
      let indexFound = null;
      for(let i = 0; i<toFilter.length; i++){
        if(toFilter[i].trim().toLowerCase().includes(str.trim().toLowerCase())) indexFound = i;
      }      
      if(indexFound === null) isFound =  false;
      else toFilter.splice(indexFound, 1);
    });
    return isFound;
}