import {
  Hash,
  Clock,
  CheckCircle,
  List,
  FileText,
  Signature,
  Type,
  Calendar,
  ToggleLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Star,
  Image,
  Link,
  DollarSign,
  Percent,
  LucideIcon,
} from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function stringifyViewColumnValueObject(value: any): string {
  if (!value) return "";

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "object") {
    // Handle different value object types
    if (value.fetch) {
      return `fetch: ${value.fetch}`;
    }
    if (value.display) {
      return `display: "${value.display}"`;
    }
    if (value.concat && Array.isArray(value.concat)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parts = value.concat.map((part: any) =>
        stringifyViewColumnValueObject(part)
      );
      return `concat: [${parts.join(", ")}]`;
    }
    if (value.evaluate) {
      return `evaluate: ${
        value.evaluate.expression || JSON.stringify(value.evaluate)
      }`;
    }
    if (value.count) {
      const target = value.count.of || value.count;
      return `count: ${stringifyViewColumnValueObject(target)}`;
    }
    if (value.if) {
      return `if: ${JSON.stringify(
        value.if.condition
      )} then ${stringifyViewColumnValueObject(value.if.then)}${
        value.if.else
          ? ` else ${stringifyViewColumnValueObject(value.if.else)}`
          : ""
      }`;
    }
    if (value.map) {
      return `map: ${stringifyViewColumnValueObject(
        value.map.array
      )} with ${stringifyViewColumnValueObject(value.map.operation)}`;
    }
    if (value.fetchEntityType) {
      return `fetchEntityType: ${value.fetchEntityType.entityType}.${value.fetchEntityType.property}`;
    }
    if (value.loadAttachment) {
      return `loadAttachment: ${value.loadAttachment.attachmentProperty}`;
    }

    // Fallback for unknown object types
    return JSON.stringify(value);
  }

  return String(value);
}

export function mapFormFieldType(type: string): string {
  const typeMap: Record<string, string> = {
    // Basic input types
    textInput: "Text Input",
    textarea: "Text Area",
    number: "Number",
    email: "Email",
    phone: "Phone",
    url: "URL",

    // Date and time
    date: "Date",
    time: "Time",
    datetime: "Date/Time",

    // Selection types
    dropdown: "Dropdown",
    radio: "Radio Group",
    checkbox: "Checkbox",
    multiSelect: "Multi Select",
    buttonBar: "Button Bar",

    // Boolean types
    yesNo: "Yes/No",
    toggle: "Toggle",
    switch: "Switch",

    // Complex types
    lineItems: "Line Items",
    signature: "Signature",
    file: "File Upload",
    image: "Image Upload",

    // Calculated/display types
    calculated: "Calculated Field",
    display: "Display Only",
    hidden: "Hidden",

    // Address and location
    address: "Address",
    location: "Location",

    // Rating and feedback
    rating: "Rating",
    slider: "Slider",

    // Financial
    currency: "Currency",
    percentage: "Percentage",

    // User info
    userSelect: "User Select",
    entitySelect: "Entity Select",
  };

  return typeMap[type] || type.charAt(0).toUpperCase() + type.slice(1);
}

export function getFieldTypeIconComponent(type: string): LucideIcon {
  const iconMap: Record<string, LucideIcon> = {
    // Basic input types
    textInput: Type,
    textarea: FileText,
    number: Hash,
    email: Mail,
    phone: Phone,
    url: Link,

    // Date and time
    date: Calendar,
    time: Clock,
    datetime: Calendar,

    // Selection types
    dropdown: List,
    radio: CheckCircle,
    checkbox: CheckCircle,
    multiSelect: List,
    buttonBar: ToggleLeft,

    // Boolean types
    yesNo: CheckCircle,
    toggle: ToggleLeft,
    switch: ToggleLeft,

    // Complex types
    lineItems: List,
    signature: Signature,
    file: FileText,
    image: Image,

    // Calculated/display types
    calculated: Hash,
    display: Type,
    hidden: Type,

    // Address and location
    address: MapPin,
    location: MapPin,

    // Rating and feedback
    rating: Star,
    slider: ToggleLeft,

    // Financial
    currency: DollarSign,
    percentage: Percent,

    // User info
    userSelect: User,
    entitySelect: User,
  };

  return iconMap[type] || Type;
}

export function getFieldTypeColor(type: string): string {
  const colorMap: Record<string, string> = {
    // Basic input types
    textInput: "bg-blue-100 text-blue-800",
    textarea: "bg-blue-100 text-blue-800",
    number: "bg-green-100 text-green-800",
    email: "bg-purple-100 text-purple-800",
    phone: "bg-purple-100 text-purple-800",
    url: "bg-purple-100 text-purple-800",

    // Date and time
    date: "bg-orange-100 text-orange-800",
    time: "bg-orange-100 text-orange-800",
    datetime: "bg-orange-100 text-orange-800",

    // Selection types
    dropdown: "bg-indigo-100 text-indigo-800",
    radio: "bg-indigo-100 text-indigo-800",
    checkbox: "bg-indigo-100 text-indigo-800",
    multiSelect: "bg-indigo-100 text-indigo-800",
    buttonBar: "bg-indigo-100 text-indigo-800",

    // Boolean types
    yesNo: "bg-green-100 text-green-800",
    toggle: "bg-green-100 text-green-800",
    switch: "bg-green-100 text-green-800",

    // Complex types
    lineItems: "bg-yellow-100 text-yellow-800",
    signature: "bg-pink-100 text-pink-800",
    file: "bg-gray-100 text-gray-800",
    image: "bg-gray-100 text-gray-800",

    // Financial
    currency: "bg-emerald-100 text-emerald-800",
    percentage: "bg-emerald-100 text-emerald-800",
  };

  return colorMap[type] || "bg-gray-100 text-gray-800";
}
