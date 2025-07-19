import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, ExternalLink, Play, FileText, BookOpen, Clock, Eye, ThumbsUp } from "lucide-react";

interface Resource {
  id: number;
  title: string;
  type: string;
  url: string;
  thumbnailUrl?: string;
  duration?: string;
  provider?: string;
  views?: string;
  rating?: number;
}

interface ModuleWithResources {
  id: number;
  title: string;
  description: string;
  estimatedHours: number;
  resources: Resource[];
}

interface ResourceModalProps {
  module: ModuleWithResources;
  onClose: () => void;
}

export default function ResourceModal({ module, onClose }: ResourceModalProps) {
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  const getResourceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video':
        return <Play className="w-5 h-5 text-red-500" />;
      case 'article':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'documentation':
        return <BookOpen className="w-5 h-5 text-green-500" />;
      default:
        return <BookOpen className="w-5 h-5 text-gray-500" />;
    }
  };

  const getResourceTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'article':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'documentation':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getProviderColor = (provider: string) => {
    switch (provider?.toLowerCase()) {
      case 'youtube':
        return 'bg-red-500 text-white hover:bg-red-600';
      case 'mdn':
      case 'mozilla':
        return 'bg-blue-500 text-white hover:bg-blue-600';
      case 'medium':
        return 'bg-gray-800 text-white hover:bg-gray-900';
      case 'github':
        return 'bg-gray-900 text-white hover:bg-black';
      default:
        return 'bg-primary text-white hover:bg-primary/90';
    }
  };

  const handleResourceClick = (resource: Resource) => {
    // Open the resource URL in a new tab
    window.open(resource.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">
                {module.title} - Learning Resources
              </CardTitle>
              <p className="text-gray-600 mt-1">{module.description}</p>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                <span>Estimated completion time: {module.estimatedHours} hours</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {module.resources.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No resources available</h3>
              <p className="text-gray-600">
                Resources for this module are being curated. Please check back later.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {module.resources.map((resource) => (
                <Card 
                  key={resource.id} 
                  className="card-hover cursor-pointer border border-gray-200"
                  onClick={() => handleResourceClick(resource)}
                >
                  <CardContent className="p-4">
                    {/* Resource Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {getResourceIcon(resource.type)}
                        <Badge variant="outline" className={getResourceTypeColor(resource.type)}>
                          {resource.type}
                        </Badge>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </div>

                    {/* Resource Content */}
                    <div className="mb-4">
                      {resource.type.toLowerCase() === 'video' && resource.provider?.toLowerCase() === 'youtube' ? (
                        <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                          {resource.thumbnailUrl ? (
                            <img 
                              src={resource.thumbnailUrl} 
                              alt={resource.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex flex-col items-center">
                              <Play className="w-12 h-12 text-red-500 mb-2" />
                              <span className="text-sm text-gray-600">YouTube Video</span>
                            </div>
                          )}
                        </div>
                      ) : resource.type.toLowerCase() === 'article' ? (
                        <div className="w-full h-24 bg-blue-50 rounded-lg mb-3 flex items-center justify-center">
                          <FileText className="w-8 h-8 text-blue-500" />
                        </div>
                      ) : (
                        <div className="w-full h-24 bg-green-50 rounded-lg mb-3 flex items-center justify-center">
                          <BookOpen className="w-8 h-8 text-green-500" />
                        </div>
                      )}

                      <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {resource.title}
                      </h4>

                      {/* Resource Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-3">
                          {resource.duration && (
                            <div className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              <span>{resource.duration}</span>
                            </div>
                          )}
                          {resource.views && (
                            <div className="flex items-center">
                              <Eye className="w-3 h-3 mr-1" />
                              <span>{resource.views}</span>
                            </div>
                          )}
                          {resource.rating && (
                            <div className="flex items-center">
                              <ThumbsUp className="w-3 h-3 mr-1" />
                              <span>{resource.rating}% liked</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Provider Info */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {resource.provider ? `${resource.provider}` : 'External Resource'}
                        </span>
                        <Button 
                          size="sm" 
                          className={getProviderColor(resource.provider || '')}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleResourceClick(resource);
                          }}
                        >
                          {resource.type.toLowerCase() === 'video' ? (
                            <>
                              <Play className="w-3 h-3 mr-1" />
                              Watch
                            </>
                          ) : (
                            <>
                              <ExternalLink className="w-3 h-3 mr-1" />
                              {resource.type.toLowerCase() === 'article' ? 'Read' : 'View'}
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              {module.resources.length} resource{module.resources.length !== 1 ? 's' : ''} available
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button 
                className="bg-primary text-white hover:bg-primary/90"
                onClick={onClose}
              >
                Continue Learning
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
