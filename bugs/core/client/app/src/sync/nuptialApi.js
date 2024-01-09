class NuptialApi {

    constructor(requester) {
        this._requester = requester;
    }

    searchNuptialMales() {
        return this._requester.get('world/nuptial_flight/search_nuptial_males').then((response) => {
            return response.data.nuptial_males;
        })
    }

}

export {
    NuptialApi
}