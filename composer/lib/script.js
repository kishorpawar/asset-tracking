/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';


async function AccelerationReading(tx) {

  const NS = 'asset.tracking.system';
  const assetNetworkReg = await getAssetRegistry(NS);

  let shipment = assetNetworkReg.shipment
  let contract = assetNetworkReg.contract;
  let acceleration = tx.acceleration;
  shipment.accelerationReadings.push(acceleration);

  // Trigger the AccThreshold Event

  const factory = getFactory();
  let accelerationThresholdEvent = factory.newEvent(NS, 'AccThreshold');
  emit(accelerationThresholdEvent);

  const newShipment = factory.newResource(NS, 'Shipment', tx.shipmentId);
  newShipment.assetType = tx.assetType.Medicine;
  newShipment.shipmentStatus = tx.shipmentStatus.Created;
  newShipment.unitCount = 10;
  newShipment.contract = contract;
  newShipment.temperatureReadings.push(tx.temperatureReadings);
  newShipment.accelerationReadings.push(tx.accelerationReadings);
  newShipment.GPSReadings.push(tx.GPSReadings);

  const registry = await getAssetRegistry(newShipment.getFullyQualifiedType());
  await registry.add(newShipment);

}

async function TemperatureReading(tx) {

  const NS = 'asset.tracking.system';
  const assetNetworkReg = await getAssetRegistry(NS + '.Shipment');

  // Trigger TempThreshold
  const factory = getFactory();
  let temperatureThresholdEvent = factory.newEvent(NS, 'TempThreshold');
  emit(temperatureThresholdEvent);

  let contract = assetNetworkReg.contract;

  await assetNetworkReg.update(tx.temperatureReadings);
}

async function GPSReading(gps_data) {

  const NS = 'asset.tracking.system';
  const assetNetworkReg = await getAssetRegistry(NS + '.Shipment');

  // Trigger ShipmentInPort
  const factory = getFactory();
  let ShipmentInPortEvent = factory.newEvent(NS, 'ShipmentInPort');
  emit(ShipmentInPortEvent);

  let contract = assetNetworkReg.contract;
  await assetNetworkReg.update(tx.GPSReadings);
}


async function ShipmentReceived(shipment) {

  const NS = 'asset.tracking.system';

  const me = getCurrentParticipant();
  const importerUser = await getAssetRegistry(me.getFullyQualifiedType());

  const assetNetworkReg = await getAssetRegistry(NS + '.Shipment');
  const exporterRegistery = await getAssetRegistry(NS + '.Exporter');
  const shiperRegistery = await getAssetRegistry(NS + '.Shipper');

  shipment.shipmentStatus = shipment.shipmentStatus.ARRIVED;
  importerUser.accountBalance = importerUser.accountBalance - (shipment.contract.unitPrice * shipment.unitCount);
  shipment.contract.exporter.accountBalance = shipment.contract.exporter.accountBalance + shipment.contract.unitPrice * shipment.unitCount;

  importerUser.update(importerUser.accountBalance);
  exporterRegistery.update(shipment.contract.exporter.accountBalance);
}