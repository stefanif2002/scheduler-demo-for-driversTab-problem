import { BryntumSchedulerProProps } from "@bryntum/schedulerpro-react";
import {TaskEditConfig} from "@bryntum/schedulerpro";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCalendar,
    faCar,
    faCircleCheck,
    faClipboard, faLocationDot,
    faUser
} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import {renderToString} from "react-dom/server";
import {statusOptions} from "./statuses";
import dayjs from "dayjs";
import {Space} from "antd";

const schedulerproProps: BryntumSchedulerProProps = {
    startDate: dayjs().startOf("month").toDate(),
    endDate: dayjs().endOf("month").toDate(),
    minDate: '2025-01-01',
    visibleDate : {
        date  : dayjs().toDate(),
        block : 'center'
    },
    viewPreset: "weekAndDayLetter",
    eventRenderer: ({ eventRecord }) => eventRecord.name,
    columns: [
        { type: "tree", text: "Car License", field: "name", width: 170 },
    ],
    treeFeature : true,
    infiniteScroll  : true,
    panFeature: true,
    eventDragCreateFeature: false,
    eventDragFeature: false,
    eventResizeFeature: false,
    filterFeature: true,

};



const userLabel = renderToString(<Space><FontAwesomeIcon icon={faUser} /> User ID</Space>);
const categoryLabel = renderToString(<Space><FontAwesomeIcon icon={faCar}/> Category</Space>);
const bookingLabel = renderToString(<Space><FontAwesomeIcon icon={faClipboard}/>Booking ID</Space>);
const websiteLabel = renderToString(<Space><FontAwesomeIcon icon={faClipboard}/>Website ID</Space>);
const statusLabel = renderToString(<Space><FontAwesomeIcon icon={faCircleCheck}/> Status</Space>);

const startLabel = renderToString(<Space><FontAwesomeIcon icon={faCalendar}/> Start Date</Space>);
const sLocationLabel = renderToString(<Space><FontAwesomeIcon icon={faLocationDot}/> Start Location</Space>);
const endLabel = renderToString(<Space><FontAwesomeIcon icon={faCalendar}/> End Date</Space>);
const eLocationLabel = renderToString(<Space><FontAwesomeIcon icon={faLocationDot}/> End Location</Space>);

const externalLabel = renderToString(<Space><FontAwesomeIcon icon={faCar}/> External Vehicle</Space>);
const licenseLabel = renderToString(<Space><i className="bi bi-card-heading"></i> Car License</Space>);




const taskEditConfig = (categories: { text: string; value: string }[]): TaskEditConfig => ({
    // Change editor title
    editorConfig : {
        title : 'Booking ',
    },

    // Customize its contents
    items : {
        generalTab : {
            // Customize the title of the general tab
            title : 'Common',
            items : {
                // Hide the end date field
                durationField: null,
                percentDoneField: null,
                effortField: null,
                nameField : null,
                resourcesField: null,
                startDateField: null,
                endDateField: null,

                idField: {
                    type   : 'text',
                    name   : 'id',
                    label  : bookingLabel,
                    disabled: true,
                    // Place after name field
                    weight : 100
                },

                // Add a field to edit order name
                websiteIdField: {
                    type   : 'text',
                    name   : 'website_booking_id',
                    label  : websiteLabel,
                    disabled: true,
                    // Place after name field
                    weight : 110
                },

                categoryIdField: {
                    type  : 'combo',
                    items: categories,  // Use the dynamically fetched categories
                    editable : false,
                    name   : 'category_id',
                    label  : categoryLabel,
                    // Place after name field
                    weight : 120
                },

                userIdField: {
                    type   : 'text',
                    name   : 'user_id',
                    label  : userLabel,
                    weight : 130
                },

                statusField : {
                    type  : 'combo',
                    items    : statusOptions,
                    editable : false,
                    name  : 'status',
                    label : statusLabel,
                    weight : 140

                }
            }

        },

        datesTab : {
            title : 'Dates & Loc/s',
            items : {
                startDateField: {
                    type: 'dateTimeField',
                    name  : 'startDate',
                    label : startLabel
                },
                startLocationField : {
                    type  : 'text',
                    name  : 'startLocation',
                    label : sLocationLabel
                },
                endDateField: {
                    type: 'dateTimeField',
                    name  : 'endDate',
                    label : endLabel
                },
                endLocationField : {
                    type  : 'text',
                    name  : 'endLocation',
                    label : eLocationLabel
                }
            },
            // Show it after generalTab, which has weight 100
            weight : 120
        },

        extraTab : {
            defaults : {
                labelWidth : '5em'
            },
            title : 'Car',
            items : {
                licenseField: {
                    type   : 'text',
                    name   : 'license',
                    label  : licenseLabel,
                    disabled: ({ record }) => {
                        console.log("Record in licenseField:", record);
                        return !record.external_car;
                    },
                    weight : 140
                },

                externalField: {
                    type   : 'slideToggle',
                    name   : 'external_car',
                    label  : externalLabel,
                    readOnly: true,
                    weight : 150,
                    onChange: ({ source }) => {
                        const editor = source.owner;
                        if (editor && editor.widgetMap) {
                            const licenseField = editor.widgetMap.licenseField;
                            if (licenseField) {
                                //console.log("Toggling license field:", !source.value);
                                licenseField.disabled = !source.value;
                            }
                        } else {
                            console.error("Editor or widgetMap not found", editor);
                        }
                    },

                },
            },
            // Show it after generalTab, which has weight 100
            weight : 150
        },

        driversTab: {

            title: 'Drivers',
            layoutStyle : {
                flexFlow : 'column nowrap'
            },

            onAddClick: ({ source }) => {
                const editor = source.owner.owner;
                if (editor && editor.widgetMap && editor.widgetMap.driversGrid) {
                    const grid = editor.widgetMap.driversGrid;

                    // using grid, add a row where I will insert the data
                    if (grid.store) {

                        const newDriver = { name: '', phone: '' };

                        // Add a new empty record
                        const newRecord = grid.store.add(newDriver)[0];

                        editor.record.drivers = [...(editor.record.drivers || []), newDriver];


                        if (newRecord) {
                            // Start editing the 'name' field of the newly added row
                            grid.features.cellEdit.startEditing({
                                record: newRecord,
                                field: 'name'
                            });
                        }
                    } else {
                        console.error("Grid store not found!");
                    }
                } else {
                    console.error("driversGrid reference not found!");
                }
            },

            onDeleteClick: ({ source }) => {
                console.log("delete clicked", source);
                const editor = source.owner.owner;
                if (editor && editor.widgetMap && editor.widgetMap.driversGrid) {
                    const grid = editor.widgetMap.driversGrid;

                    // using grid, add a row where I will insert the data
                    if (grid.store) {
                        // Add a new empty record
                        grid.store.remove(grid.selectedRecords[0]); // Remove selected row

                    } else {
                        console.error("Grid store not found!");
                    }
                } else {
                    console.error("driversGrid reference not found!");
                }
            },

            items: {
                driversGrid: {
                    type: 'grid',  // Use a grid to display multiple drivers
                    ref: 'driversGrid',
                    flex     : 1,
                    minWidth : 500,
                    name: 'drivers',
                    label: 'Drivers',
                    weight: 100,
                    columns: [
                        //{ text: 'Driver Name', field: 'name', editor: 'text' }, // Editable field
                        { text: 'Phone', field: 'phone', editor: 'text' }  // Editable field
                    ],
                    store: {
                        //fields: ['name', 'phone'],
                        data: [] // This will be populated dynamically
                    }
                },

                // Buttons BELOW the grid
                driversButtonsContainer: {
                    type: 'toolbar',
                    dock  : 'bottom',
                    cls   : 'b-compact-bbar',
                    weight: 200,
                    items: {
                        add: {
                            type: 'button',
                            ref: 'addButton',
                            cls: 'b-green',
                            icon: 'b-fa-plus',
                            tooltip: 'Add driver',
                            small: true,  // Make the button smaller
                            onAction: "up.onAddClick"
                        },
                        remove : {
                            type: 'button',
                            ref: 'removeButton',
                            icon: 'b-fa-trash',
                            cls: 'b-red',
                            tooltip: 'Remove selected driver',
                            small: true,  // Make the button smaller
                            onAction: "up.onDeleteClick"
                        }
                    }
                }
            },
            weight: 200
        },

        predecessorsTab: null,
        successorsTab: null,
        advancedTab: null,

        // Add a custom tab with some fields
        paymentsTab : {
            title : 'Payments',
            layoutStyle : {
                flexFlow : 'column nowrap'
            },
            items: {

            },
            // Show it after generalTab, which has weight 100
            weight : 250
        }
    }
});

export { schedulerproProps, taskEditConfig };
