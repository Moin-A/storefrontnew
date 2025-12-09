import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button"
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select";
import { Check, Plus } from "lucide-react";

export function AddressSection({
  title,
  useDefault,
  onDefaultChange,
  addresses,
  selectedAddress,
  onAddressChange,
  showNewAddressForm,
  setShowNewAddressForm,
  newAddress,
  onNewAddressChange,
  onAddNewAddress,
  COUNTRIES,
  STATES,
  sameAsLabel
}) {
  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <label className="flex items-center">
          <input
            type="checkbox"
            disabled={addresses.length === 0}
            checked={useDefault}
            onChange={(e) => onDefaultChange(e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-gray-600">{sameAsLabel}</span>
        </label>
      </div>

      {/* Address List */}
      {!useDefault && (
        <>
          {addresses.length > 0 && (
            <div className="space-y-3 mb-6">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedAddress?.id === address.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => onAddressChange(address)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {address.firstname} {address.lastname}
                      </h3>
                      <p className="text-sm text-gray-600">{address.phone}</p>
                      <div className="text-sm text-gray-600 mt-1">
                        <p>{address.address1}</p>
                        {address.address2 && <p>{address.address2}</p>}
                        <p>
                          {address.city}, {address.state_name} {address.zipcode}
                        </p>
                        <p>{address.country_name}</p>
                      </div>
                    </div>
                    {selectedAddress?.id === address.id && (
                      <Check className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add New Address Button */}
          <Button
            variant="outline"
            onClick={() => setShowNewAddressForm(!showNewAddressForm)}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            {showNewAddressForm ? "Cancel" : "Add New Address"}
          </Button>

          {/* Add New Address Form */}
          {showNewAddressForm && (
            <div className="mt-6 space-y-4">
              {[
                { id: "name", label: "Name", required: true, placeholder: "Full name" },
                { id: "address1", label: "Address Line 1", required: true, placeholder: "Street address" },
                { id: "address2", label: "Address Line 2", placeholder: "Apartment, suite, etc. (optional)" },
                { id: "city", label: "City", required: true, placeholder: "City" },
                { id: "zipcode", label: "ZIP Code", required: true, placeholder: "ZIP code" },
                { id: "phone", label: "Phone Number", required: true, placeholder: "Phone number" },
              ].map((field) => (
                <div key={field.id}>
                  <Label htmlFor={`new-${field.id}`} className="mb-2 block">
                    {field.label}{" "}
                    {field.required && <span className="text-red-500">*</span>}
                  </Label>
                  <Input
                    id={`new-${field.id}`}
                    value={newAddress[field.id] || ""}
                    onChange={(e) =>
                      onNewAddressChange({
                        ...newAddress,
                        [field.id]: e.target.value,
                      })
                    }
                    placeholder={field.placeholder}
                  />
                </div>
              ))}

              

              {/* State Select */}
              <div className="d-flex flex gap-10 justify-between">
              <div className="w-100"  style = {{width:'100%'}}  >
                <Label htmlFor="new-state" className="mb-2 block">
                  State <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={newAddress.state_id}
                  onValueChange={(value) =>
                    onNewAddressChange({ ...newAddress, state_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATES.map((state) => (
                      <SelectItem key={state.id} value={state.id}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Country Select */}
              <div style = {{width:'100%'}} className="w-100">
                <Label htmlFor="new-country" className="mb-2 block">
                  Country <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={newAddress.country_id}
                  onValueChange={(value) =>
                    onNewAddressChange({ ...newAddress, country_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country.id} value={country.id}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              </div>

              <Button onClick={onAddNewAddress} className="w-full">
                Add {title}
              </Button>
            </div>
          )}
        </>
      )}
    </Card>
  );
}
