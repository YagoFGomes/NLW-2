export default function convertHourToMinuters(time:string){
    //08:00

    const [hour, minutes] = time.split(':').map(Number);

    const timeInMinutes = (hour * 60) + minutes;

    return timeInMinutes;

}