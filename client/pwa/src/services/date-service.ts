import moment from "moment";

class DateService {

    constructor () {
        moment.locale('fr');
    }
    public convertToFrLocale(date: Date): string {
        return moment(date).format('L');
    }
}

export default new DateService();