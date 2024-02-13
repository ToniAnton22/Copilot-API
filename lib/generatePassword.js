export default function generatePassword(){
    const characters= "QWERTYUIOPASDFGHJKLZXVCBNM,./?!@qwertyuiopasdfghjklzxcvbnm"
    var length = 8
    var retVal = ""
    for (var i = 0, n=characters.length; i < length; i++){
        retVal += characters.charAt(Math.floor(Math.random() *n))
    }
    return retVal
}