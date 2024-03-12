export default function checkMistake(mistakeType,feedSession){
    switch(mistakeType){
        case "NoStop":
            feedSession.set(mistakeType, "Seems like you haven't stopped at the stop sign. Make sure you completely stop the car when reaching the stop sign.")
            break;
        case "RightCheck":
            feedSession.set(mistakeType, "You need to look right and check to see for incoming vehicles.")
            break;
        case "LeftCheck":
            feedSession.set(mistakeType, "Left checking is als important, check to see if there are any incoming vehicle!")
            break;
        case "TrafficLight": 
            feedSession.set(mistakeType,"Ups! The traffic light has gone red by the time you reached it. You can avoid crossing on red by slowing down when the orange light comes up!")
            break;
        case "Speeding":
            feedSession.set(mistakeType,"You were going above the speed limit. Be mindful of your speed and always check for speed signs to manage your speed accordingly. You got this!")
            break;
        case "Crashed":
            feedSession.set(mistakeType, "Crashing should be avoided at all cost.")
            break;
        case "Forbbiden Road":
            feedSession.set(mistakeType,"You crossed a forbbiden road. Never enter those for your own safety.")
            break;
        case "NoBlinkerLeft":
            feedSession.set(mistakeType, "Blinkers are important ways of communicating, blinking left signals that you intend to go left. Try being mindful of those.")
            break;
        case "NoBlinkerRight":
            feedSession.set(mistakeType,"Blinkers are important ways of communicating, blinking left signals that you intend to go right. Try being mindful of those.")
            break;
        default:
            feedSession.set(mistakeType,"We did not account for this type of mistake.")
            break;
    }
    return feedSession
}