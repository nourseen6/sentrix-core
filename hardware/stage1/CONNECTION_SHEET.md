# SENTRIX CORE — Stage-one bench connection sheet

This sheet is the wiring law for the stage-one development-kit bench. The simulator in `sim/` checks against these rules.

The current hardware direction is Hardware Design Specification Rev A0 (8 July 2026): nRF5340, nRF9151, BMI270, MAX86176, MAX30208, IM69D130, nPM1300, and a DRV2605-class haptic driver. Research-paper Table 39 (nRF52840 DK, SIM7080G, u-blox MAX-M10S) is the previous kit list and is not this bench.

Two kinds of wire are in the reference net:

- **Official.** A manufacturer user guide names this pin, this header, and this mate.
- **Lab.** The hardware specification names the bus and the voltage, and does not assign development-kit GPIO numbers. The GPIO below is a SentriX choice on a free Arduino-header pin of the nRF5340 DK. Firmware may move it. The bus, the direction, and the voltage may not.

## What each kit actually exposes

| Kit | Stage-one role | How it connects on a bench |
| --- | --- | --- |
| nRF5340 DK | Application MCU, BLE, SOS stand-in | Arduino headers, P21 external supply, Button 1 |
| nRF9151 DK | LTE-M / NB-IoT and GNSS, as a modem | UART and ground only. The DK is powered from its own USB. Its PCB antenna is the stage-one antenna |
| nPM1300 EK | Charger and rails | Pin headers. Nordic publishes the cable to the nRF5340 DK |
| BMI270 shuttle | Motion | Shuttle P1/P2 pins, wired by hand. Not the Bosch application board |
| MAX86176 signals | PPG / ECG | SPI signals of the part. The stock MAX86176EVSYS talks from its own MCU over Bluetooth and is not this cable |
| MAX30208 signals | Temperature | I2C of the part. The stock MAX30208EVSYS host is a MAX32630FTHR |
| IM69D130 flex adapter | Microphone | Official flex-adapter pins, PDM into the nRF5340 |
| DRV2605EVM-CT | Haptic driver class named in the specification | External I2C and the OUT terminal, with a discrete LRA on OUT |

Button 1 on the nRF5340 DK (P0.23) is the stage-one SOS input. The Alps switch in the specification is the later custom board.

## Switches before the first power-up

| Control | Position | Source |
| --- | --- | --- |
| nPM1300 EK supply | Battery on J1/J2, or VBUS. Reference bench: battery present, VBUS open | nPM1300 EK user guide, power inputs |
| nRF5340 SW10 VEXT→nRF | ON | Nordic, "Use the nPM1300 EK with an nRF5340 DK" |
| nRF5340 SW9 nRF power source | VDD | Same note. USB on J2 then powers only the interface MCU |
| nRF9151 DK | USB connected so the modem board is alive | nRF9151 DK user guide, kit power |

Configure the EK in nPM PowerUP before trusting the rails: VOUT2 at the default 3.0 V (VSET2), LDO1 at 1.8 V, LDO2 at 3.3 V. LDO mode needs the P16 bypass jumper fitted (nPM1300 EK user guide, load switches/LDOs).

## Rails

| Rail | EK pin | Voltage | Feeds |
| --- | --- | --- | --- |
| Buck 2 | P5 pin 1 VOUT2 | 3.0 V default | nRF5340 P21, BMI270, MAX30208, and LDO1 input |
| Unregulated | VSYS pin header | Battery voltage | LDO2 input. The header designator is Figure 6 of the EK user guide |
| LDO1 | P8 pin 3 OUT1 | 1.8 V after configuration | MAX86176 analog supply |
| LDO2 | P8 pin 4 OUT2 | 3.3 V after configuration | IM69D130 and the haptic driver |

P8 pin 1 (IN1) is fed from VOUT2. P8 pin 2 (IN2) is fed from VSYS, because a 3.3 V LDO cannot be produced from the 3.0 V buck.

The nRF9151 DK is not powered from this EK. Stage one uses the modem board's own supply and connects UART plus ground.

## Official nPM1300 EK to nRF5340 DK

From Nordic, "Use the nPM1300 EK with an nRF5340 DK". The reference bench uses the power, ground, TWI, and GPIO0 rows. GPIO1–GPIO4 and SHPHLD stay free so those DK pins are not stolen from the sensors.

| nPM1300 EK | nRF5340 DK | Function |
| --- | --- | --- |
| P5 pin 1 VOUT2 | P21 pin 1 | 3.0 V into the SoC external supply |
| P5 pin 3 GND | P21 pin 2 | Ground |
| P11 pin 1 SDA | P1.02, Arduino D14, P4 pin 9 | TWI data |
| P11 pin 2 SCL | P1.03, Arduino D15, P4 pin 10 | TWI clock |
| P12 pin 1 GPIO0 | P1.10, Arduino D8, P4 pin 1 | PMIC interrupt |

Arduino names are the nRF5340 DK map in the Zephyr board file `nrf5340dk_common.dtsi`, which matches Nordic's analog table and this TWI mapping.

DK pins left off this cable, and why:

| DK GPIO | Already used by | Source |
| --- | --- | --- |
| P0.00, P0.01 | 32 kHz crystal | nRF5340 DK user guide, connector interface |
| P0.19–P0.22 | UART to the interface MCU (serial port 1) | Same guide, virtual serial ports |
| P1.00, P1.01 | UART to the interface MCU (serial port 0) | Same table |
| P0.02, P0.03 | NFC by default | Connector interface |
| P0.08, P0.09, P0.23, P0.24 | Buttons. P0.23 is Button 1, the SOS stand-in | Buttons and LEDs |
| P0.28–P0.31 | LEDs | Buttons and LEDs |
| P0.13–P0.18 | External flash, unless solder bridges are cut | External memory |

## Shared I2C

One bus, on the Nordic TWI pins above. Pull-ups: the DK connects I2C pull-ups when a shield grounds shield-detect, or SB32 is shorted (nRF5340 DK user guide, signal switches). A loose-wire bench has to add those pull-ups to VDD or short SB32.

| Device | 7-bit address | How the address is fixed |
| --- | --- | --- |
| nPM1300 | 0x6B | Fixed. Product specification, TWI chapter, address 1101011 |
| BMI270 | 0x68 | SDO/MISO tied to GND. SDO high would be 0x69. CSB tied to VDDIO so the host interface is I2C |
| MAX30208 | 0x50 | Power-up default when GPIO0 and GPIO1 read low. Datasheet I2C address table. Range is 0x50–0x53 |
| DRV2605 | 0x5A | Fixed on the TI part. EVM external-I2C header needs SDA, SCL, GND, and EN high |

No two of these share an address. The haptic driver is the class named in the specification ("DRV2605L-class"), not a locked BOM line.

## Lab GPIO on the nRF5340 DK

Free Arduino pins used for the buses the specification names and Nordic does not pin out.

| Function | nRF5340 DK | Mate | Bus |
| --- | --- | --- | --- |
| UART TX | D2 / P1.04 | nRF9151 P0.03 RX | UART, crossed |
| UART RX | D3 / P1.05 | nRF9151 P0.02 TX | UART, crossed |
| SPI SCK | D4 / P1.06 | MAX86176 SCLK | SPI |
| SPI MOSI | D5 / P1.07 | MAX86176 SDI | SPI |
| SPI MISO | D6 / P1.08 | MAX86176 SDO | SPI |
| SPI CS | D7 / P1.09 | MAX86176 CSB | SPI |
| PPG interrupt | A0 / P0.04 | MAX86176 INT | GPIO |
| PDM clock | A1 / P0.05 | IM69D130 CLOCK (adapter pin 3) | PDM |
| PDM data | A2 / P0.06 | IM69D130 DATA (adapter pin 2) | PDM |
| IMU interrupt | A3 / P0.07 | BMI270 INT1 | GPIO |
| Temperature alert | A5 / P0.26 | MAX30208 GPIO0 / ALERT | GPIO |

nRF9151 UART pins are the Serial Modem external-MCU overlay: TX P0.02, RX P0.03, 115200 baud, on connector P4. That overlay also assigns RTS P0.06, CTS P0.07, and DTR P0.31, and it tells you to disable VCOM0 and VCOM1 before an external host owns the UART. The hardware specification only requires TX and RX. The reference bench wires TX, RX, and ground, and the simulator warns that stock Serial Modem firmware still expects flow control and DTR until the overlay turns them off.

IM69D130 adapter pin 1 is VDD, pin 4 is SELECT, and the shell is GND (Infineon flex-adapter pin table). SELECT is tied to GND so the microphone is the left channel. VDD is the 3.3 V LDO.

BMI270 shuttle, host connector: SCL is the SCK/SCL pin, SDA is the MOSI/SDA pin, plus VDD, VDDIO, GND, INT1. CSB is tied to VDDIO. This is the shuttle flyer pin list, used in I2C mode.

## Reference net

Ground is one net: nPM1300 GND, nRF5340 P21.2, and the GND pin of every other board except the LRA. The LRA is a floating load on the driver outputs.

| From | To | Class |
| --- | --- | --- |
| nPM1300 P5.1 VOUT2 | nRF5340 P21.1 | Official |
| nPM1300 P5.3 GND | nRF5340 P21.2 GND | Official |
| nPM1300 P11.1 SDA | nRF5340 D14 SDA | Official |
| nPM1300 P11.2 SCL | nRF5340 D15 SCL | Official |
| nPM1300 P12.1 GPIO0 | nRF5340 D8 | Official |
| nPM1300 VOUT2 | nPM1300 P8.1 IN1 | Rail feed |
| nPM1300 VSYS | nPM1300 P8.2 IN2 | Rail feed |
| nPM1300 P8.3 OUT1 | MAX86176 VDD | 1.8 V |
| nPM1300 P8.4 OUT2 | IM69D130 VDD | 3.3 V |
| nPM1300 P8.4 OUT2 | DRV2605 VDD | 3.3 V |
| nRF5340 VDD | BMI270 VDD and VDDIO | 3.0 V IO |
| nRF5340 VDD | MAX30208 VDD | 3.0 V |
| nRF5340 GND | GND of BMI270, MAX30208, MAX86176, IM69D130, DRV2605, nRF9151 | Ground |
| BMI270 SCL, SDA | nRF5340 SCL, SDA | I2C |
| BMI270 CSB | BMI270 VDDIO | I2C select |
| BMI270 SDO | BMI270 GND | Address 0x68 |
| BMI270 INT1 | nRF5340 A3 | GPIO |
| MAX30208 SDA, SCL, ALERT | nRF5340 SDA, SCL, A5 | I2C + alert |
| MAX86176 SCLK, SDI, SDO, CSB, INT | nRF5340 D4, D5, D6, D7, A0 | SPI |
| IM69D130 CLOCK, DATA | nRF5340 A1, A2 | PDM |
| IM69D130 SELECT | IM69D130 GND | Channel |
| nRF5340 D2 TX | nRF9151 P0.03 RX | UART crossed |
| nRF5340 D3 RX | nRF9151 P0.02 TX | UART crossed |
| DRV2605 SDA, SCL | nRF5340 SDA, SCL | I2C |
| DRV2605 EN | DRV2605 VDD | Enable high |
| DRV2605 OUT+ / OUT− | LRA + / − | Actuator |

## Checks the bench enforces

A wire is rejected as a fault when:

- two outputs drive one net (TX to TX, two regulator outputs tied, two interrupt pins tied)
- a data pin lands on the wrong function (SDA on SCL, MOSI on SCK, power on a GPIO)
- a regulator voltage is above the pin's maximum (VBUS or VSYS into P21, which is 1.7 V to 3.6 V)
- two boards share a signal or a supply and do not share ground
- BMI270 is on I2C while CSB is not tied high
- two devices on the same SDA net claim the same 7-bit address

These stay visible and do not block a careful power-up:

- MAX86176 IO at 1.8 V against the nRF5340 DK at 3.0 V. The specification puts the AFE on the 1.8 V LDO and the MCU on the 3.0 V buck, and it does not name a level shifter. The bench shows that gap instead of hiding it.
- Microphone and haptic IO at 3.3 V against MCU IO at 3.0 V.
- I2C pull-ups are a DK solder-bridge or extra resistors, not a wire in the net.
- UART flow control and DTR are unwired until the Serial Modem overlay is changed.
- nRF9151 VDD_GPIO must be confirmed against the DK user guide before the UART cable is trusted.
- LDO voltages exist only after nPM PowerUP configuration.

## Behavior the simulator will run

Once the net has no fault and the rails the switch settings actually produce are up:

- Button 1 (P0.23) is an SOS press on its own. It does not wait for a model.
- A fall stimulus pulses BMI270 INT1, then the same notify path.
- A phone nearby is a BLE notify. No phone, with the modem USB up and the UART crossed, is an AT command exchange at 115200 with a lab coordinate, not a person's location.
- PPG contact, temperature, and a PDM tone are stimuli on the corresponding bus. No contact is a flat optical reading.

The waveforms and the AT text are a behavioral model of this net. They are not silicon, RF, or GNSS simulation.

## Documents

- nRF5340 DK hardware: https://docs.nordicsemi.com/bundle/ug_nrf5340_dk/page/UG/dk/intro.html
- nRF5340 DK connectors: https://docs.nordicsemi.com/bundle/ug_nrf5340_dk/page/UG/dk/connector_if.html
- nPM1300 EK on an nRF5340 DK: https://docs.nordicsemi.com/bundle/ug_npm1300_ek/page/UG/npm1300_ek/using_nrf5340_dk.html
- nPM1300 EK: https://docs.nordicsemi.com/bundle/ug_npm1300_ek/page/UG/npm1300_ek/intro.html
- nRF9151 DK: https://docs.nordicsemi.com/bundle/ug_nrf9151_dk/page/UG/nrf91_dk/intro.html
- Serial Modem UART: https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/applications/serial_lte_modem/doc/slm_description.html
- nPM1300 TWI address: https://docs.nordicsemi.com/bundle/ps_npm1300/page/chapters/core_components/ctrl_reg/doc/frontpage.html
- BMI270 datasheet: https://www.bosch-sensortec.com/media/boschsensortec/downloads/datasheets/bst-bmi270-ds000.pdf
- BMI270 shuttle flyer: https://www.bosch-sensortec.com/media/boschsensortec/downloads/shuttle_board_flyer/application_board_3_1/bst-bmi270-sf000.pdf
- MAX86176: https://www.analog.com/en/products/max86176.html
- MAX30208: https://www.analog.com/en/products/max30208.html
- IM69D130 flex kit: https://www.infineon.com/evaluation-board/EVAL-IM69D130-FLEXKIT
- DRV2605EVM-CT user guide: https://www.ti.com/lit/ug/slou348b/slou348b.pdf
