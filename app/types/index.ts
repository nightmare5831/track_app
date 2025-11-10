export interface Equipment {
  _id: string;
  name: string;
  type: 'excavator' | 'truck' | 'drill' | 'loader' | 'other';
  registrationNumber: string;
  status: 'active' | 'inactive' | 'maintenance';
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface Material {
  _id: string;
  name: string;
  category: 'fuel' | 'explosives' | 'tools' | 'parts' | 'consumables' | 'other';
  quantity: number;
  unit: 'kg' | 'liter' | 'piece' | 'ton' | 'meter';
  location?: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  _id: string;
  title: string;
  type: 'excavation' | 'drilling' | 'transportation' | 'blasting' | 'maintenance' | 'other';
  equipment?: string;
  location?: {
    latitude?: number;
    longitude?: number;
    address?: string;
  };
  startTime: string;
  endTime?: string;
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
