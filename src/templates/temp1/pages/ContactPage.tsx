import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { GeneratedContent } from '@/types/generated-website';
import { EditableField } from '@/components/website-preview/EditableField';

interface ContactPageProps {
  content: GeneratedContent['pages']['contact'];
  isDark: boolean;
  isNeutral: boolean;
  isEditable?: boolean;
  onFieldEdit?: (fieldPath: string, newValue: string) => void;
}

export function ContactPage({ content, isDark, isNeutral, isEditable = false, onFieldEdit }: ContactPageProps) {
  const heroGradient = isDark 
    ? 'from-slate-800 to-slate-900' 
    : isNeutral 
      ? 'from-stone-100 to-stone-200'
      : 'from-primary/5 to-primary/10';

  const cardBg = isDark ? 'bg-slate-800' : isNeutral ? 'bg-white' : 'bg-white';
  const cardBorder = isDark ? 'border-slate-700' : 'border-gray-100';
  const inputBg = isDark ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200';

  const handleFieldEdit = (fieldPath: string, newValue: string) => {
    if (onFieldEdit) {
      onFieldEdit(fieldPath, newValue);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className={`py-16 md:py-24 bg-gradient-to-br ${heroGradient}`}>
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {content.hero.title}
          </h1>
          <p className={`text-xl ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
            {content.hero.subtitle}
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold mb-8">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    isDark ? 'bg-primary/20' : 'bg-primary/10'
                  }`}>
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Address</h3>
                    <p className={`${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                      {content.info.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    isDark ? 'bg-primary/20' : 'bg-primary/10'
                  }`}>
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Phone</h3>
                    {isEditable ? (
                      <EditableField
                        value={content.info.phone}
                        fieldPath="pages.contact.info.phone"
                        onSave={handleFieldEdit}
                        className={`${isDark ? 'text-slate-400' : 'text-gray-500'}`}
                        isEditable={isEditable}
                      />
                    ) : (
                      <p className={`${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                        {content.info.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    isDark ? 'bg-primary/20' : 'bg-primary/10'
                  }`}>
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Email</h3>
                    {isEditable ? (
                      <EditableField
                        value={content.info.email}
                        fieldPath="pages.contact.info.email"
                        onSave={handleFieldEdit}
                        className={`${isDark ? 'text-slate-400' : 'text-gray-500'}`}
                        isEditable={isEditable}
                      />
                    ) : (
                      <p className={`${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                        {content.info.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    isDark ? 'bg-primary/20' : 'bg-primary/10'
                  }`}>
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Working Hours</h3>
                    <p className={`${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                      {content.info.hours}
                    </p>
                  </div>
                </div>
              </div>

              {/* Working Hours Table */}
              {content.workingHours && content.workingHours.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-semibold mb-4">Detailed Schedule</h3>
                  <div className={`rounded-xl ${cardBg} border ${cardBorder} overflow-hidden`}>
                    <table className="w-full">
                      <tbody>
                        {content.workingHours.map((item, index) => (
                          <tr 
                            key={index}
                            className={`border-b last:border-b-0 ${isDark ? 'border-slate-700' : 'border-gray-100'}`}
                          >
                            <td className={`px-4 py-3 font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                              {item.day}
                            </td>
                            <td className={`px-4 py-3 text-right ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                              {item.hours}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Map Placeholder */}
              <div className="mt-8">
                <h3 className="font-semibold mb-4">Find Us</h3>
                <div className={`h-48 rounded-xl ${isDark ? 'bg-slate-700' : 'bg-gray-200'} flex items-center justify-center`}>
                  <div className="text-center">
                    <MapPin className={`w-8 h-8 mx-auto mb-2 ${isDark ? 'text-slate-500' : 'text-gray-400'}`} />
                    <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                      Map placeholder
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form (Display Only) */}
            <div className={`p-8 rounded-2xl ${cardBg} border ${cardBorder} shadow-sm`}>
              <h2 className="text-2xl font-bold mb-2">{content.form.title}</h2>
              <p className={`mb-6 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                {content.form.subtitle}
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                    Your Name
                  </label>
                  <input 
                    type="text"
                    placeholder="John Doe"
                    disabled
                    className={`w-full px-4 py-3 rounded-lg border ${inputBg} cursor-not-allowed opacity-75`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                    Email Address
                  </label>
                  <input 
                    type="email"
                    placeholder="john@example.com"
                    disabled
                    className={`w-full px-4 py-3 rounded-lg border ${inputBg} cursor-not-allowed opacity-75`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                    Phone Number
                  </label>
                  <input 
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    disabled
                    className={`w-full px-4 py-3 rounded-lg border ${inputBg} cursor-not-allowed opacity-75`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                    Message
                  </label>
                  <textarea 
                    rows={4}
                    placeholder="How can we help you?"
                    disabled
                    className={`w-full px-4 py-3 rounded-lg border ${inputBg} resize-none cursor-not-allowed opacity-75`}
                  />
                </div>
                <button 
                  disabled
                  className="w-full py-3 px-6 rounded-lg bg-primary text-primary-foreground font-medium cursor-not-allowed opacity-75"
                >
                  Send Message
                </button>
                <p className={`text-xs text-center ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                  This form is for preview only. Contact functionality available in premium version.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
