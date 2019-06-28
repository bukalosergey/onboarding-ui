const csvService = {

    /**
     * 
     * @param {*[]} data 
     */
    exportDataToCsv(data) {

        const csvContent = "data:text/csv;charset=utf-8," + data.map(e => `"${e.join('","')}"`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "my_data.csv");
        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
    }
}

export default csvService;