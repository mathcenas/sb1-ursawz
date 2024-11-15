import React, { useState } from 'react';
import { ExternalLink, Server, Check, X, Cloud, ChevronDown, ChevronUp, Briefcase, HeartHandshake } from 'lucide-react';
import type { Service } from '../types';
import { timeAgo } from '../utils/timeAgo';

interface ServiceCardProps {
  service: Service;
  onCheck: (id: string) => void;
}

export function ServiceCard({ service, onCheck }: ServiceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left p-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Server className="w-4 h-4 text-blue-600" />
          <div>
            <h3 className="font-medium text-gray-800">{service.name}</h3>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Briefcase className="w-3 h-3" />
              {service.projectName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
            service.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {service.isActive ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
            {service.isActive ? 'Active' : 'Inactive'}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 border-t pt-4 space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="flex items-center gap-2 text-gray-600">
                <span className="font-medium">IP:</span>
                {service.ip}
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 text-gray-500">
              <Cloud className="w-4 h-4" />
              {service.cloudProvider}
            </div>
          </div>

          <div className="text-sm">
            <p className="flex items-center gap-2 text-gray-600">
              <span className="font-medium">URL:</span>
              <a 
                href={service.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                {service.url} <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>

          <div className="flex items-center justify-between text-sm">
            <p className="text-gray-600">{service.description}</p>
            <span className="font-medium text-emerald-600">${service.monthlyCost}/mo</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <HeartHandshake className="w-4 h-4 text-purple-500" />
            <span className="font-medium">Supported by:</span>
            {service.supportedBy}
          </div>

          <div className="flex items-center justify-between text-sm pt-3 border-t">
            <span className="text-gray-500">
              Last checked: {timeAgo(new Date(service.lastCheck))}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCheck(service.id);
              }}
              className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors text-sm"
            >
              Check Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}