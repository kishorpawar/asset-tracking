# Digital Property Network

> This Defines a business network where house sellers can list their properties for sale.

This business network defines:

**Participant**
`User`

**Assets**
`Property` `PropertyListing`

**Transaction**
`createProperty`, `intentForSale`, `purchaseProperty`

The `createProperty` transaction is used to register a new property to the system. For example, if a `User` wants to create a property `Prop 1`, then the `createProperty` transaction is invoked. This creates the property `Prop 1` in the Property Asset Registry.

The `intentForSale` transaction is called when a `User` wants to list his/her property for sale in the `Property Listing Asset Registry`.

To test this Business Network Definition in the **Test** tab:

Create two `Person` participants:

```
{
  "$class": "property.registration.system.User",
  "userId": "userId:user00001",
  "userName": "Kishor",
  "userEmail": "krisp1506@gmail.com",
  "uidNum": "3582ca23-5371-427f-84ec-cb57ce7320b5",
  "bankName": "Whatever Bank is it",
  "bankAdd": "Whatever address",
  "accountNum": "sb000102",
  "ifscCode": "HDFC0093K",
  "balance": 20000000,
}
```

```
{
  "$class": "property.registration.system.User",
  "userId": "userId:user00002",
  "userName": "Advait",
  "userEmail": "advait0914@gmail.com",
  "uidNum": "3582ca23-5371-427f-84ec-cb520b57ce73",
  "bankName": "Whatever Bank is it",
  "bankAdd": "Whatever address",
  "accountNum": "sb000105",
  "ifscCode": "HDFC0093K",
  "balance": 2000000,
}
```

Create a `Property` asset:

```
{
  "$class": "property.registration.system.Property",
  "propertyId" : "propertyId:ABCD",
  "marketPrice" : 1000000,
  "registrationDate" : GetTxTimestamp(),
  "propertyType" : "1BHK",
  "location" : Borivali,
  "status" :'Registered'
  "owner" : "resource:property.registration.system.User#userId:user00002:Advait",
}
```

Create a `PropertyListing` asset:

```
{
  "$class": "property.registration.system.PropertyListing",
  "propertyListingId": "propListId:1234",
  "property": "resource:property.registration.system.User#user00002:Advait",
}
```

Submit a `createProperty` transaction:

```
{
  "$class" : "property.registration.system.createProperty",
  "propertyId" : "resource:property.registration.system.Property#propertyId:ABCD",
  "marketPrice" : 10000000,
  "registratinoDate" : GetTxTimestamp(),
  "propertyType" : '1BHK',
  "location" : 'Borivali',
}
```

Submit a `intentForSale` transaction:

```
{
  "$class" : "property.registration.system.intentForSale",
  "propertyId" : "resource:property.registration.system.Property#propertyId:ABCD",
}
```

Submit a `purchaseProperty` transaction:

```
{
  "$class" : "property.registration.system.purchaseProperty",
  "propertyId" : "resource:property.registration.system.PropertyListing#propListId:1234",
}
```

Congratulations!

## License <a name="license"></a>
Hyperledger Project source code files are made available under the Apache License, Version 2.0 (Apache-2.0), located in the LICENSE file. Hyperledger Project documentation files are made available under the Creative Commons Attribution 4.0 International License (CC-BY-4.0), available at http://creativecommons.org/licenses/by/4.0/.