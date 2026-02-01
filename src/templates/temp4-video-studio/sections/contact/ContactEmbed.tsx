import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { EditableText } from '@/components/website-preview/EditableText';
import { EditableSection } from '@/components/website-preview/EditableSection';
import type { EditorSelection } from '@/components/website-preview/EditorSidebar';

interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  hours: string;
}

interface ContactEmbedProps {
  title: string;
  subtitle: string;
  info: ContactInfo;
  isEditable?: boolean;
  editorSelection?: EditorSelection | null;
  onEditorSelect?: (selection: EditorSelection) => void;
  onMoveSection?: (direction: 'up' | 'down') => void;
  onDeleteSection?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export function ContactEmbed({
  title,
  subtitle,
  info,
  isEditable = false,
  editorSelection,
  onEditorSelect,
  onMoveSection,
  onDeleteSection,
  isFirst,
  isLast,
}: ContactEmbedProps) {
  const isTitleSelected = editorSelection?.sectionId === 'contact' &&
    editorSelection?.fields?.some(f => f.fieldPath === 'pages.contact.hero.title');

  return (
    <EditableSection
      sectionId="contact"
      sectionName="Contact"
      isEditable={isEditable}
      onMoveUp={() => onMoveSection?.('up')}
      onMoveDown={() => onMoveSection?.('down')}
      onDelete={onDeleteSection}
      isFirst={isFirst}
      isLast={isLast}
    >
      <section className="py-24 bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-4">
                Get In Touch
              </span>
              <EditableText
                value={title}
                fieldPath="pages.contact.hero.title"
                fieldLabel="Contact Title"
                sectionTitle="Contact Section"
                sectionId="contact"
                as="h2"
                isEditable={isEditable}
                isSelected={isTitleSelected}
                onSelect={onEditorSelect}
                className="text-4xl md:text-5xl font-bold text-white mb-6"
              />
              <p className="text-slate-400 text-lg mb-10">{subtitle}</p>

              {/* Contact Details */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Location</h4>
                    <p className="text-slate-400">{info.address}</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Email</h4>
                    <p className="text-slate-400">{info.email}</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Phone</h4>
                    <p className="text-slate-400">{info.phone}</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Hours</h4>
                    <p className="text-slate-400">{info.hours}</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800">
                <h3 className="text-2xl font-bold text-white mb-6">Send us a message</h3>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-slate-400 mb-2 block">Name</label>
                      <Input
                        placeholder="Your name"
                        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-slate-400 mb-2 block">Email</label>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">Subject</label>
                    <Input
                      placeholder="Project inquiry"
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">Message</label>
                    <Textarea
                      placeholder="Tell us about your project..."
                      rows={5}
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 resize-none"
                    />
                  </div>
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    Send Message
                    <Send className="w-4 h-4 ml-2" />
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </EditableSection>
  );
}
