"use client"
import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputNumber, InputNumberChangeEvent, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { Slider, SliderChangeEvent } from 'primereact/slider';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBolt, FaRupeeSign, FaLightbulb, FaSolarPanel, FaHistory, FaSave, FaTrash, FaChartPie } from 'react-icons/fa';
import { MdOutlineTipsAndUpdates } from "react-icons/md";
interface TariffPlan {
  name: string;
  rate: number;
}

interface Appliance {
  name: string;
  consumption: number;
  hours: number;
}

interface HistoryEntry {
  date: string;
  units: number;
  cost: number;
}

const ElectricityCalculator: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<TariffPlan | null>(null);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [newApplianceName, setNewApplianceName] = useState<string>('');
  const [solarPanels, setSolarPanels] = useState<number>(0);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showTips, setShowTips] = useState<boolean>(false);
  const [units, setUnits] = useState<number>(0);
  const [newApplianceConsumption, setNewApplianceConsumption] = useState<number | null>(null);
  const [newApplianceHours, setNewApplianceHours] = useState<number>(1);
  const [showChart, setShowChart] = useState<boolean>(false);

  const tariffPlans: TariffPlan[] = [
    { name: 'Residential', rate: 5.5 },
    { name: 'Commercial', rate: 7.2 },
    { name: 'Industrial', rate: 6.8 },
  ];

  useEffect(() => {
    calculateCost();
  }, [units, selectedPlan, appliances, solarPanels]);

  const calculateCost = () => {
    if (selectedPlan) {
      const rate = selectedPlan.rate;
      const applianceConsumption = appliances.reduce((total, appliance) => 
        total + (appliance.consumption * appliance.hours), 0);
      const totalUnits = Math.max(0, units + applianceConsumption - (solarPanels * 4));
      const baseAmount = totalUnits * rate;
      const tax = baseAmount * 0.18; // 18% GST
      setTotalCost(baseAmount + tax);
    }
  };

  const addAppliance = () => {
    if (newApplianceName && newApplianceConsumption !== null) {
      setAppliances([...appliances, { 
        name: newApplianceName, 
        consumption: newApplianceConsumption,
        hours: newApplianceHours
      }]);
      setNewApplianceName('');
      setNewApplianceConsumption(null);
      setNewApplianceHours(1);
    }
  };

  const removeAppliance = (index: number) => {
    const updatedAppliances = appliances.filter((_, i) => i !== index);
    setAppliances(updatedAppliances);
  };

  const calculateTotalConsumption = () => {
    return appliances.reduce((total, appliance) => total + (appliance.consumption * appliance.hours), 0);
  };

  const saveToHistory = () => {
    const newEntry: HistoryEntry = {
      date: new Date().toLocaleDateString(),
      units: units,
      cost: totalCost
    };
    setHistory([...history, newEntry]);
  };

  const chartData = {
    labels: appliances.map((a) => a.name),
    datasets: [
      {
        data: appliances.map((a) => a.consumption * a.hours),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
        ],
      },
    ],
  };

  const energySavingTips = [
    "Use LED bulbs instead of incandescent ones",
    "Unplug electronics when not in use",
    "Use natural light whenever possible",
    "Install a programmable thermostat",
    "Use energy-efficient appliances",
    "Clean or replace air filters regularly",
    "Use ceiling fans to reduce AC usage",
    "Seal air leaks around windows and doors",
    "Use power strips to easily turn off multiple devices",
    "Wash clothes in cold water when possible",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-black bg-opacity-50 backdrop-filter backdrop-blur-lg border border-purple-500 rounded-lg shadow-2xl overflow-hidden">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-20 animate-pulse"></div>
            <div className="relative z-10 p-6">
              <motion.h1
                className="text-4xl sm:text-5xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <FaBolt className="inline-block mr-2 text-yellow-400" />
                Bijli Buddy: Indian Power Calculator
              </motion.h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label htmlFor="units" className="block mb-2 font-semibold text-lg">
                    Units Consumed
                  </label>
                  <InputNumber
  id="units"
  value={units}
  onValueChange={(e: InputNumberValueChangeEvent) => setUnits(e.value ?? 0)}
  min={0}
  max={10000}
  className="w-full p-inputtext-lg"
  showButtons
  buttonLayout="horizontal"
  decrementButtonClassName="p-button-danger"
  incrementButtonClassName="p-button-success"
  incrementButtonIcon="pi pi-plus"
  decrementButtonIcon="pi pi-minus"
/>
                </div>

                <div>
                  <label htmlFor="plan" className="block mb-2 font-semibold text-lg">
                    Tariff Plan
                  </label>
                  <Dropdown
                    id="plan"
                    value={selectedPlan}
                    options={tariffPlans}
                    onChange={(e: DropdownChangeEvent) => setSelectedPlan(e.value)}
                    optionLabel="name"
                    placeholder="Select a plan"
                    className="w-full p-inputtext-lg"
                  />
                </div>
              </div>

              <div className="mb-8">
                <label htmlFor="solarPanels" className="block mb-2 font-semibold text-lg">
                  Number of Solar Panels
                </label>
                <div className="flex items-center">
                  <FaSolarPanel className="text-yellow-400 mr-2 text-2xl" />
                  <Slider
                    value={solarPanels}
                    onChange={(e: SliderChangeEvent) => setSolarPanels(e.value as number)}
                    min={0}
                    max={20}
                    className="w-full"
                  />
                  <span className="ml-2 text-lg">{solarPanels} panels</span>
                </div>
              </div>

              <motion.div
                className="text-4xl sm:text-5xl font-bold text-center mb-8"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.3, repeat: Infinity, repeatType: 'reverse' }}
              >
                <FaRupeeSign className="inline-block mr-1 text-green-400" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                  {totalCost.toFixed(2)}
                </span>
              </motion.div>

              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <Button
                  label={showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
                  icon="pi pi-cog"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="p-button-outlined p-button-secondary p-button-lg"
                />
                <Button
                  label="Save to History"
                  icon={<FaSave className="mr-2" />}
                  onClick={saveToHistory}
                  className="p-button-success p-button-lg"
                />
                <Button
                  label="View History"
                  icon={<FaHistory className="mr-2" />}
                  onClick={() => setShowHistory(true)}
                  className="p-button-info p-button-lg"
                />
              </div>

              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-3xl font-semibold mb-6 text-center">
                      <FaLightbulb className="inline-block mr-2 text-yellow-400" />
                      Appliance Calculator
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <InputText
                        placeholder="Appliance Name"
                        value={newApplianceName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewApplianceName(e.target.value)}
                        className="p-inputtext-lg"
                      />
                     <InputNumber
                    placeholder="Consumption (kWh)"
                    value={newApplianceConsumption}
                    onValueChange={(e: InputNumberValueChangeEvent) => setNewApplianceConsumption(e.value ?? null)}
                    min={0}
                    className="p-inputtext-lg"
                    />

                    <InputNumber
                    placeholder="Hours per day"
                    value={newApplianceHours}
                    onValueChange={(e: InputNumberValueChangeEvent) => setNewApplianceHours(e.value ?? 0)}
                    min={0}
                    max={24}
                    className="p-inputtext-lg"
                    />
                      <Button
                        label="Add Appliance"
                        icon="pi pi-plus"
                        className="p-button-success p-button-lg"
                        onClick={addAppliance}
                      />
                    </div>

                    <DataTable value={appliances} className="mb-6">
                      <Column field="name" header="Appliance" />
                      <Column field="consumption" header="Consumption (kWh)" />
                      <Column field="hours" header="Hours per day" />
                      <Column body={(rowData: Appliance, options) => (
                        <Button
                          icon={<FaTrash />}
                          className="p-button-danger p-button-sm"
                          onClick={() => removeAppliance(options.rowIndex)}
                        />
                      )} />
                    </DataTable>

                    <div className="text-xl font-semibold mb-6">
                      <strong>Total Consumption: </strong>
                      <span className="text-green-400">{calculateTotalConsumption()} kWh</span>
                    </div>

                    <div className="text-center">
                      <Button
                        label="View Consumption Chart"
                        icon={<FaChartPie className="mr-2" />}
                        onClick={() => setShowChart(true)}
                        className="p-button-info p-button-lg"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                className="mt-8 text-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  label="Energy Saving Tips"
                  icon={<MdOutlineTipsAndUpdates  className="mr-2" />}
                  onClick={() => setShowTips(true)}
                  className="p-button-warning p-button-lg"
                />
              </motion.div>
            </div>
          </div>
        </Card>
      </motion.div>

      <Dialog
        header="Calculation History"
        visible={showHistory}
        onHide={() => setShowHistory(false)}
        style={{ width: '90vw', maxWidth: '600px' }}
        breakpoints={{ '960px': '75vw', '641px': '100vw' }}
      >
        <DataTable value={history} paginator rows={5} className="p-datatable-sm">
          <Column field="date" header="Date" />
          <Column field="units" header="Units" />
          <Column field="cost" header="Cost" body={(rowData: HistoryEntry) => `₹${rowData.cost.toFixed(2)}`} />
        </DataTable>
      </Dialog>

      <Dialog
        header="Energy Saving Tips"
        visible={showTips}
        onHide={() => setShowTips(false)}
        style={{ width: '90vw', maxWidth: '600px' }}
        breakpoints={{ '960px': '75vw', '641px': '100vw' }}
      >
        <ul className="list-disc pl-6">
          {energySavingTips.map((tip, index) => (
            <motion.li
              key={index}
              className="mb-3 text-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {tip}
            </motion.li>
            ))}
            </ul>
          </Dialog>
    
          <Dialog
            header="Consumption Chart"
            visible={showChart}
            onHide={() => setShowChart(false)}
            style={{ width: '90vw', maxWidth: '600px' }}
            breakpoints={{ '960px': '75vw', '641px': '100vw' }}
          >
            <Chart type="pie" data={chartData} options={{ 
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    color: '#ffffff'
                  }
                }
              }
            }} />
          </Dialog>
        </div>
      );
    };
    
    export default ElectricityCalculator;