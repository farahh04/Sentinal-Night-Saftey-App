export interface PoliceStation {
  id: string;
  name: string;
  city: string;
  sector: string;
  lat: number;
  lng: number;
  phone: string;
  email: string;
  areaType: 'HIGH_PRIORITY' | 'STANDARD' | 'HIGH_RISK';
  securityCompany?: string;
  status: 'Active' | 'Busy' | 'Understaffed' | 'Critical';
}

export interface SafeHaven {
  id: string;
  name: string;
  type: 'Hospital' | 'Gas Station' | 'Restaurant' | 'Security' | 'Police';
  address: string;
  city: string;
  lat: number;
  lng: number;
  is247: boolean;
  phone: string;
}

export const PAKISTAN_POLICE_STATIONS: PoliceStation[] = [
  // KARACHI
  { id: 'khi-dha', name: 'DHA Police Station', city: 'Karachi', sector: 'Phase 8, Karachi', lat: 24.8607, lng: 67.0670, phone: '021-99244500', email: 'dha.khi@policesafe.pk', areaType: 'HIGH_PRIORITY', securityCompany: 'DHA Security', status: 'Active' },
  { id: 'khi-clifton', name: 'Clifton Police Station', city: 'Karachi', sector: 'Block 5, Clifton', lat: 24.8095, lng: 67.0296, phone: '021-99244501', email: 'clifton.khi@policesafe.pk', areaType: 'HIGH_PRIORITY', status: 'Active' },
  { id: 'khi-gulshan', name: 'Gulshan-e-Iqbal', city: 'Karachi', sector: 'Main University Road', lat: 24.9022, lng: 67.0925, phone: '021-99244700', email: 'gulshan.khi@policesafe.pk', areaType: 'STANDARD', status: 'Active' },
  { id: 'khi-saddar', name: 'Saddar Police Station', city: 'Karachi', sector: 'Preedy Street', lat: 24.8514, lng: 67.0049, phone: '021-99244200', email: 'saddar.khi@policesafe.pk', areaType: 'STANDARD', status: 'Active' },
  { id: 'khi-korangi', name: 'Korangi Police Station', city: 'Karachi', sector: 'Korangi No 4', lat: 24.8485, lng: 67.1450, phone: '021-99244800', email: 'korangi.khi@policesafe.pk', areaType: 'HIGH_RISK', status: 'Busy' },
  { id: 'khi-landhi', name: 'Landhi Police Station', city: 'Karachi', sector: 'Landhi No 5', lat: 24.8770, lng: 67.2120, phone: '021-99244900', email: 'landhi.khi@policesafe.pk', areaType: 'STANDARD', status: 'Active' },
  { id: 'khi-malir', name: 'Malir Police Station', city: 'Karachi', sector: 'Malir Halt', lat: 24.8604, lng: 67.2006, phone: '021-99244600', email: 'malir.khi@policesafe.pk', areaType: 'STANDARD', status: 'Active' },
  { id: 'khi-nn', name: 'North Nazimabad', city: 'Karachi', sector: 'Block N', lat: 24.9200, lng: 67.0400, phone: '021-99244400', email: 'nn.khi@policesafe.pk', areaType: 'STANDARD', status: 'Busy' },
  { id: 'khi-orangi', name: 'Orangi Town', city: 'Karachi', sector: 'Sector 11', lat: 24.9470, lng: 66.9930, phone: '021-99244100', email: 'orangi.khi@policesafe.pk', areaType: 'HIGH_RISK', status: 'Understaffed' },
  { id: 'khi-lyari', name: 'Lyari Police Station', city: 'Karachi', sector: 'Baghdadi', lat: 24.8730, lng: 66.9960, phone: '021-99244300', email: 'lyari.khi@policesafe.pk', areaType: 'HIGH_RISK', status: 'Critical' },
  { id: 'khi-boat', name: 'Boat Basin', city: 'Karachi', sector: 'Clifton', lat: 24.8150, lng: 67.0350, phone: '021-99244510', status: 'Active', areaType: 'HIGH_PRIORITY', email: 'boat.khi@policesafe.pk' },
  { id: 'khi-shf', name: 'Shahrah-e-Faisal', city: 'Karachi', sector: 'Near Airport', lat: 24.8700, lng: 67.0800, phone: '021-99244520', status: 'Active', areaType: 'HIGH_PRIORITY', email: 'shf.khi@policesafe.pk' },
  
  // LAHORE
  { id: 'lhr-defc', name: 'Defence C Police', city: 'Lahore', sector: 'Phase 2, Defence', lat: 31.3500, lng: 74.3200, phone: '042-99240000', email: 'defc.lhr@policesafe.pk', areaType: 'HIGH_PRIORITY', status: 'Active' },
  { id: 'lhr-gulberg', name: 'Gulberg Police', city: 'Lahore', sector: 'Main Boulevard', lat: 31.5250, lng: 74.3400, phone: '042-99240100', email: 'gulberg.lhr@policesafe.pk', areaType: 'HIGH_PRIORITY', status: 'Active' },
  { id: 'lhr-dha', name: 'DHA Police Lahore', city: 'Lahore', sector: 'Phase 6, DHA', lat: 31.4000, lng: 74.3700, phone: '042-99240200', email: 'dha.lhr@policesafe.pk', areaType: 'HIGH_PRIORITY', securityCompany: 'DHA Security', status: 'Active' },
  { id: 'lhr-mt', name: 'Model Town Police', city: 'Lahore', sector: 'Block B', lat: 31.4680, lng: 74.3450, phone: '042-99240300', email: 'mt.lhr@policesafe.pk', areaType: 'STANDARD', status: 'Active' },
  { id: 'lhr-jt', name: 'Johar Town Police', city: 'Lahore', sector: 'Sector K', lat: 31.4600, lng: 74.2800, phone: '042-99240400', email: 'jt.lhr@policesafe.pk', areaType: 'STANDARD', status: 'Busy' },
  { id: 'lhr-city', name: 'City Police Station', city: 'Lahore', sector: 'Anarkali', lat: 31.5820, lng: 74.3230, phone: '042-99240500', email: 'city.lhr@policesafe.pk', areaType: 'STANDARD', status: 'Active' },
  { id: 'lhr-women', name: 'Women Police Station', city: 'Lahore', sector: 'Gulberg', lat: 31.5250, lng: 74.3400, phone: '042-99240600', email: 'women.lhr@policesafe.pk', areaType: 'STANDARD', status: 'Active' },

  // ISLAMABAD
  { id: 'isb-sec', name: 'Secretariat', city: 'Islamabad', sector: 'Red Zone', lat: 33.7280, lng: 73.0940, phone: '051-111-111-111', email: 'sec.isb@policesafe.pk', areaType: 'HIGH_PRIORITY', status: 'Active' },
  { id: 'isb-aab', name: 'Aabpara', city: 'Islamabad', sector: 'Aabpara Market', lat: 33.7160, lng: 73.0870, phone: '051-111-222-222', email: 'aab.isb@policesafe.pk', areaType: 'STANDARD', status: 'Active' },
  { id: 'isb-koh', name: 'Kohsar', city: 'Islamabad', sector: 'F-6 Markaz', lat: 33.6900, lng: 73.0300, phone: '051-111-333-333', email: 'koh.isb@policesafe.pk', areaType: 'HIGH_PRIORITY', status: 'Active' },
  { id: 'isb-women', name: 'Women Police', city: 'Islamabad', sector: 'F-7 Markaz', lat: 33.7100, lng: 73.0700, phone: '051-111-444-444', email: 'women.isb@policesafe.pk', areaType: 'STANDARD', status: 'Active' },
  { id: 'isb-sheh', name: 'Shehzad Town', city: 'Islamabad', sector: 'Park Road', lat: 33.6700, lng: 73.1500, phone: '051-111-555-555', status: 'Busy', areaType: 'STANDARD', email: 'sheh.isb@policesafe.pk' },
  { id: 'isb-gol', name: 'Golra', city: 'Islamabad', sector: 'Golra Sharif', lat: 33.6800, lng: 72.9800, phone: '051-111-666-666', status: 'Active', areaType: 'STANDARD', email: 'gol.isb@policesafe.pk' },

  // RAWALPINDI
  { id: 'rwp-saddar', name: 'Saddar', city: 'Rawalpindi', sector: 'Saddar Road', lat: 33.6110, lng: 73.0630, phone: '051-111-777-777', email: 'saddar.rwp@policesafe.pk', areaType: 'STANDARD', status: 'Active' },
  { id: 'rwp-civil', name: 'Civil Lines', city: 'Rawalpindi', sector: 'Civil Lines', lat: 33.5970, lng: 73.0540, phone: '051-111-888-888', email: 'civil.rwp@policesafe.pk', areaType: 'HIGH_PRIORITY', status: 'Active' },
  { id: 'rwp-air', name: 'Airport', city: 'Rawalpindi', sector: 'Chaklala', lat: 33.6110, lng: 73.0960, phone: '051-111-999-999', email: 'air.rwp@policesafe.pk', areaType: 'STANDARD', status: 'Active' },

  // FAISALABAD
  { id: 'fsd-civil', name: 'Civil Lines', city: 'Faisalabad', sector: 'Civil Lines', lat: 31.4180, lng: 73.0790, phone: '041-111-111-111', status: 'Active', areaType: 'STANDARD', email: 'civil.fsd@policesafe.pk' },
  { id: 'fsd-peo', name: "People's Colony", city: 'Faisalabad', sector: "People's Colony", lat: 31.4100, lng: 73.1000, phone: '041-111-222-222', status: 'Active', areaType: 'STANDARD', email: 'peo.fsd@policesafe.pk' },
];

export const SAFE_HAVENS: SafeHaven[] = [
  // KARACHI
  { id: 'sh-akh', name: 'Aga Khan Hospital', type: 'Hospital', address: 'Stadium Road', city: 'Karachi', lat: 24.8924, lng: 67.0747, is247: true, phone: '021-111-911-911' },
  { id: 'sh-sch', name: 'South City Hospital', type: 'Hospital', address: 'Shahrah-e-Faisal', city: 'Karachi', lat: 24.8143, lng: 67.0321, is247: true, phone: '021-111-111-111' },
  { id: 'sh-mcd8', name: 'McDonalds Phase 8', type: 'Restaurant', address: 'Phase 8', city: 'Karachi', lat: 24.7733, lng: 67.0622, is247: true, phone: '021-111-222-333' },
  { id: 'sh-pso8', name: 'PSO DHA Phase 8', type: 'Gas Station', address: 'Phase 8', city: 'Karachi', lat: 24.7712, lng: 67.0654, is247: true, phone: '021-111-776-776' },
  { id: 'sh-dsp8', name: 'DHA Security Post', type: 'Security', address: 'Main Boulevard', city: 'Karachi', lat: 24.7800, lng: 67.0700, is247: true, phone: '021-111-342-342' },
  { id: 'sh-kphq', name: 'Karachi Police HQ', type: 'Police', address: 'Garden Road', city: 'Karachi', lat: 24.8700, lng: 67.0200, is247: false, phone: '021-99244400' },
  
  // LAHORE
  { id: 'sh-nhl', name: 'National Hospital', type: 'Hospital', address: 'DHA', city: 'Lahore', lat: 31.4725, lng: 74.3725, is247: true, phone: '042-111-111-111' },
  { id: 'sh-kfcg', name: 'KFC Gulberg', type: 'Restaurant', address: 'Main Boulevard', city: 'Lahore', lat: 31.5125, lng: 74.3450, is247: true, phone: '042-111-222-333' },
  { id: 'sh-psod', name: 'PSO Defence', type: 'Gas Station', address: 'Defence', city: 'Lahore', lat: 31.4800, lng: 74.3800, is247: true, phone: '042-111-776-776' },
  { id: 'sh-dhas', name: 'DHA Security', type: 'Security', address: 'DHA Phase 6', city: 'Lahore', lat: 31.4100, lng: 74.4000, is247: true, phone: '042-111-342-342' },
  
  // ISLAMABAD
  { id: 'sh-poly', name: 'Polyclinic', type: 'Hospital', address: 'G-6', city: 'Islamabad', lat: 33.7125, lng: 73.0825, is247: true, phone: '051-111-111-111' },
  { id: 'sh-mcdf7', name: 'McDonalds F-7', type: 'Restaurant', address: 'F-7 Markaz', city: 'Islamabad', lat: 33.7200, lng: 73.0500, is247: true, phone: '051-111-222-333' },
];

export function getAreaSafetyProfile(lat: number, lng: number) {
  const station = findNearestStation(lat, lng);
  let policeETA = 25;
  let securityETA = null;

  if (station.areaType === 'HIGH_PRIORITY') {
    policeETA = 8;
    securityETA = 4;
  } else if (station.areaType === 'HIGH_RISK') {
    policeETA = 45;
  } else {
    policeETA = 20;
  }

  return {
    station,
    policeETA,
    securityETA,
    riskLevel: station.areaType,
    isReliable: station.areaType !== 'HIGH_RISK'
  };
}

export function findNearestStation(lat: number, lng: number): PoliceStation {
  return PAKISTAN_POLICE_STATIONS.reduce((prev, curr) => {
    const prevDist = Math.sqrt(Math.pow(prev.lat - lat, 2) + Math.pow(prev.lng - lng, 2));
    const currDist = Math.sqrt(Math.pow(curr.lat - lat, 2) + Math.pow(curr.lng - lng, 2));
    return currDist < prevDist ? curr : prev;
  });
}

export function findNearbySafeHavens(lat: number, lng: number, limit = 5): SafeHaven[] {
  return [...SAFE_HAVENS]
    .sort((a, b) => {
      const distA = Math.sqrt(Math.pow(a.lat - lat, 2) + Math.pow(a.lng - lng, 2));
      const distB = Math.sqrt(Math.pow(b.lat - lat, 2) + Math.pow(b.lng - lng, 2));
      return distA - distB;
    })
    .slice(0, limit);
}