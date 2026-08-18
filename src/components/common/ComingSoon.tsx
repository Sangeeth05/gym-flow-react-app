import React from 'react';
import { Construction } from 'lucide-react';

interface Props {
  feature: string;
}

const ComingSoon: React.FC<Props> = ({ feature }) => (
  <div className="flex flex-col items-center justify-center h-64 text-center space-y-3 animate-fade-in">
    <div className="w-16 h-16 bg-brand-500/10 rounded-2xl flex items-center justify-center">
      <Construction className="w-8 h-8 text-brand-400" />
    </div>
    <h2 className="text-xl font-bold text-white">{feature}</h2>
    <p className="text-slate-400 text-sm">This section is under construction and coming soon.</p>
  </div>
);

export default ComingSoon;
