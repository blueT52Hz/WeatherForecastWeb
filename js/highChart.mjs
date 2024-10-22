export function drawChart(categories, temperatureData, humidityData, visibilityData) {
    // Khởi tạo biểu đồ Highcharts
    Highcharts.chart('container', {
        chart: {
            type: 'line',  // Loại biểu đồ đường
            backgroundColor: 'transparent'  
        },
        title: {
            text: 'Today Highlight'
        },
        xAxis: {
            categories: categories,  // Các mốc giờ trong ngày
        },
        yAxis: [
            {
            title: {
                // text: 'Temperature (°C)'
                text: null
            },
            labels: {
                enabled: false
            },
            opposite: false
        }, {
            title: {
                // text: 'Humidity (%)'
                text: null
            },
            labels: {
                enabled: false
            },
            opposite: false
        }, {
            title: {
                // text: 'Visibility (km)'
                text: null
            },
            labels: {
                enabled: false
            },
            opposite: false
        }, {
            title: {
                // text: 'Pressure (hPa)'
                text: null
            },
            labels: {
                enabled: false
            },
            opposite: false
        }
        ],
        tooltip: {
            shared: true,
            useHTML: true
        },
        plotOptions: {
            line: {
                dataLabels: {
                    // Hiển thị giá trị của các điểm dữ liệu
                    enabled: true,
                },
                enableMouseTracking: false
            }
        },
        series: [{
            name: '<span style="color:#2CAFFE;">Temperature</span>',
            data: temperatureData,
            tooltip: {
                valueSuffix: '°C',
            },
            visible: true,
            dataLabels: {
                style: {
                    color: '#2CAFFE'  // Đặt màu chữ cho data label của Temperature
                }
            }
        }, {
            name: '<span style="color:#544FC5;">Humidity</span>',
            data: humidityData,
            yAxis: 1,
            tooltip: {
                valueSuffix: '%'
            },
            visible: false,
            dataLabels: {
                style: {
                    color: '#544FC5'  // Đặt màu chữ cho data label của Temperature
                }
            }
        }, {
            name: '<span style="color:#00E272;">Visibility</span>',
            data: visibilityData,
            yAxis: 2,
            tooltip: {
                valueSuffix: ' km'
            },
            visible: false,
            dataLabels: {
                style: {
                    color: '#00E272'  // Đặt màu chữ cho data label của Temperature
                }
            }
        }]
    });
}

const categories = ['00h', '03h', '06h', '09h', '12h', '15h', '18h', '21h', '24h'];
const temperatureData = [15, 13, 10, 12, 18, 21, 20, 17, 17];
const humidityData = [80, 85, 90, 78, 75, 70, 65, 68, 68];
const visibilityData = [10, 9, 9.5, 8, 10, 10.5, 9.8, 10, 10];

// drawChart(categories, temperatureData, humidityData, visibilityData);