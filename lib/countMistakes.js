export default function countMistake(mistakeType,counted){
    if( counted.size <1){
        counted.set(mistakeType,1)
        return counted
    }
    if(!counted.get(mistakeType)){
        counted.set(mistakeType,1)
    }else{
        counted.set(mistakeType,counted.get(mistakeType) +1)    
    }
    return counted
}