import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { WorkingHoursItem } from '@/types/generated-website';

interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  hours: string;
}

interface ContactInlineSectionProps {
  info: ContactInfo;
  workingHours?: WorkingHoursItem[];
  isDark: boolean;
  isNeutral: boolean;
  isEditable: boolean;
}

export function ContactInlineSection({
  info,
  workingHours,
  isDark,
  isNeutral,
  isEditable,
}: ContactInlineSectionProps) {
  return (
    <section className={cn(
      'py-20',
      isDark ? 'bg-slate-900' : isNeutral ? 'bg-stone-50' : 'bg-white'
    )} id="contact">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className={cn(
            'inline-block px-4 py-1 rounded-full text-sm font-medium mb-4',
            isDark ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'
          )}>
            Contact Us
          </span>
          <h2 className={cn(
            'text-3xl md:text-4xl font-bold mb-4',
            isDark ? 'text-white' : isNeutral ? 'text-stone-900' : 'text-gray-900'
          )}>
            Get In Touch
          </h2>
          <p className={cn(
            'text-lg max-w-2xl mx-auto',
            isDark ? 'text-slate-400' : isNeutral ? 'text-stone-600' : 'text-gray-600'
          )}>
            We'd love to hear from you. Reach out to us using any of the methods below.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left - Contact Info */}
          <div className="space-y-8">
            {/* Contact Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className={cn(
                'p-6 rounded-xl border',
                isDark ? 'bg-slate-800 border-slate-700' : isNeutral ? 'bg-white border-stone-200' : 'bg-gray-50 border-gray-200'
              )}>
                <MapPin className="w-8 h-8 text-primary mb-4" />
                <h3 className={cn(
                  'font-semibold mb-2',
                  isDark ? 'text-white' : 'text-gray-900'
                )}>
                  Address
                </h3>
                <p className={cn(
                  'text-sm',
                  isDark ? 'text-slate-400' : 'text-gray-600'
                )}>
                  {info.address}
                </p>
              </div>

              <div className={cn(
                'p-6 rounded-xl border',
                isDark ? 'bg-slate-800 border-slate-700' : isNeutral ? 'bg-white border-stone-200' : 'bg-gray-50 border-gray-200'
              )}>
                <Phone className="w-8 h-8 text-primary mb-4" />
                <h3 className={cn(
                  'font-semibold mb-2',
                  isDark ? 'text-white' : 'text-gray-900'
                )}>
                  Phone
                </h3>
                <p className={cn(
                  'text-sm',
                  isDark ? 'text-slate-400' : 'text-gray-600'
                )}>
                  {info.phone}
                </p>
              </div>

              <div className={cn(
                'p-6 rounded-xl border',
                isDark ? 'bg-slate-800 border-slate-700' : isNeutral ? 'bg-white border-stone-200' : 'bg-gray-50 border-gray-200'
              )}>
                <Mail className="w-8 h-8 text-primary mb-4" />
                <h3 className={cn(
                  'font-semibold mb-2',
                  isDark ? 'text-white' : 'text-gray-900'
                )}>
                  Email
                </h3>
                <p className={cn(
                  'text-sm',
                  isDark ? 'text-slate-400' : 'text-gray-600'
                )}>
                  {info.email}
                </p>
              </div>

              <div className={cn(
                'p-6 rounded-xl border',
                isDark ? 'bg-slate-800 border-slate-700' : isNeutral ? 'bg-white border-stone-200' : 'bg-gray-50 border-gray-200'
              )}>
                <Clock className="w-8 h-8 text-primary mb-4" />
                <h3 className={cn(
                  'font-semibold mb-2',
                  isDark ? 'text-white' : 'text-gray-900'
                )}>
                  Hours
                </h3>
                <p className={cn(
                  'text-sm',
                  isDark ? 'text-slate-400' : 'text-gray-600'
                )}>
                  {info.hours}
                </p>
              </div>
            </div>

            {/* Working Hours Table */}
            {workingHours && workingHours.length > 0 && (
              <div className={cn(
                'p-6 rounded-xl border',
                isDark ? 'bg-slate-800 border-slate-700' : isNeutral ? 'bg-white border-stone-200' : 'bg-gray-50 border-gray-200'
              )}>
                <h3 className={cn(
                  'font-semibold mb-4',
                  isDark ? 'text-white' : 'text-gray-900'
                )}>
                  Working Hours
                </h3>
                <div className="space-y-2">
                  {workingHours.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className={cn(
                        isDark ? 'text-slate-400' : 'text-gray-600'
                      )}>
                        {item.day}
                      </span>
                      <span className={cn(
                        'font-medium',
                        isDark ? 'text-slate-300' : 'text-gray-800'
                      )}>
                        {item.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right - Contact Form */}
          <div className={cn(
            'p-8 rounded-2xl border',
            isDark ? 'bg-slate-800 border-slate-700' : isNeutral ? 'bg-white border-stone-200' : 'bg-gray-50 border-gray-200'
          )}>
            <h3 className={cn(
              'text-xl font-semibold mb-6',
              isDark ? 'text-white' : 'text-gray-900'
            )}>
              Send us a message
            </h3>
            <form className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  placeholder="Your Name"
                  className={cn(
                    isDark ? 'bg-slate-900 border-slate-700' : ''
                  )}
                />
                <Input
                  type="email"
                  placeholder="Your Email"
                  className={cn(
                    isDark ? 'bg-slate-900 border-slate-700' : ''
                  )}
                />
              </div>
              <Input
                placeholder="Subject"
                className={cn(
                  isDark ? 'bg-slate-900 border-slate-700' : ''
                )}
              />
              <Textarea
                placeholder="Your Message"
                rows={5}
                className={cn(
                  isDark ? 'bg-slate-900 border-slate-700' : ''
                )}
              />
              <Button className="w-full" size="lg">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
