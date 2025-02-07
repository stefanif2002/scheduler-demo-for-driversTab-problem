/**
 * Application
 */
import React, {useState, useRef} from "react";
import { BryntumSchedulerPro } from "@bryntum/schedulerpro-react";
import { CalendarOutlined } from "@ant-design/icons";
import "@bryntum/schedulerpro/schedulerpro.stockholm.css";
import { schedulerproProps, taskEditConfig } from "./SchedulerProConfig";
import { useCalendarData } from "./CalendarData";

function App() {
    const schedulerRef = useRef(null);
    const [searchParams, setSearchParams] = useState({
        category_name: "",
        filterNameByCars: undefined,
        type: "",
        fuel: "",
        numOfSeats: undefined,
        automatic: undefined,
        email: "",
        telephone: "",
        AFM: "",
    });

    const { events, categories, resources, fetchBookings } = useCalendarData(searchParams);


    return (
        <div style={{display: "flex", flexDirection: "column", height: "80vh"}}>
            {/* Header */}
            <div
                style={{
                    marginLeft: "20px",
                    marginBottom: "30px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                }}
            >
                <h1 className="title">
                    <CalendarOutlined/> Booking Calendar
                </h1>
            </div>

            {/* Ignore filters and extra buttons

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >



                <Filters
                    onFilterChange={handleFilterChange}
                    filterForWho="booking"
                    onSubmit={handleFilterSubmit}
                    clearAll={clearAll}
                />



                <Space>
                    <UploadButton onRefresh={() => fetchBookings(undefined)}/>
                    <Button
                        type="primary"
                        onClick={handleCreate}
                        style={{marginRight: "20px", width: "80px"}}
                        icon={<i className="bi bi-clipboard-plus"/>}
                    >
                        New
                    </Button>
                </Space>
            </div>
            */}

            {/* Scheduler Content */}
            <div
                style={{
                    flex: 1,
                    overflow: "auto",
                    width: "100%",
                    position: "relative",
                    marginTop: "20px",
                    cursor: "grab",
                }}
            >
                <BryntumSchedulerPro
                    resources={resources}
                    events={events}
                    ref={schedulerRef}
                    style={{height: "100%", width: "100%"}}
                    taskEditFeature={taskEditConfig(categories)}
                    {...schedulerproProps}
                />
            </div>
        </div>
    );
};

export default App;

