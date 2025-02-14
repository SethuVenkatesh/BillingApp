import React, { useEffect ,useState} from 'react'
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";


const LineChart = ({chartData}) => {

    const [data,setData]= useState();

    useEffect(()=>{
        console.log("chartData",chartData);
        if(chartData){

            const labels = chartData.map(chartData=>chartData.salesMonth);
            const data = {
                labels: labels,
                datasets: [
                  {
                    label: "Sales Report",
                    backgroundColor: "rgb(255, 99, 132)",
                    borderColor: "rgb(255, 99, 132)",
                    data: chartData.map(chartData=>chartData.totalSalesAmount)
                  },
                ],
            }; 
            setData(data);
        }
    },[])

    return (
      <div>
        {
            data && 
            <Line data={data} />
        }
      </div>
    );
  };

export default LineChart