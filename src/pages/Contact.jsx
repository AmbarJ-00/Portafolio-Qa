import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import { Mail, Linkedin, MapPin, Briefcase, Calendar, CheckCircle } from 'lucide-react';
import SEO from '../components/SEO.jsx';

const inputBase = 'w-full px-4 py-2.5 rounded-lg border text-sm font-medium outline-none transition-all duration-200';
const inputNormal = `${inputBase} focus:ring-2 focus:ring-offset-0`;

const Contact = () => {
  const { t } = useTranslation();
  const { store, actions } = usePortfolio();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const contactSchema = z.object({
    name: z.string().min(3, { message: t('contact.val_name_min') }),
    email: z.string().email({ message: t('contact.val_email_invalid') }),
    queryType: z.string().min(1, { message: t('contact.val_query_req') }),
    message: z.string().min(10, { message: t('contact.val_message_min') }),
    phone: z.string().optional(),
    alternativeContact: z.string().optional(),
    honeypot: z.string().optional()
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', queryType: '', message: '', phone: '', alternativeContact: '', honeypot: '' }
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
<<<<<<< HEAD
      if (!actions || !actions.submitContactForm) {
        throw new Error("Contact actions not initialized");
      }
      const result = await actions.submitContactForm(data);
      if (!result || !result.success) {
        throw new Error(t('contact.error_desc'));
      }
=======
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || t('contact.error_desc'));
>>>>>>> 02d962fc1d76a170f1cebcdb14f6f7ba1c61aa6b
      setIsSubmitted(true);
      reset();
    } catch (err) {
      console.error('Contact submission error:', err);
      setSubmitError(t('contact.error_desc'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const infoCardStyle = {
    display: 'flex', gap: '1rem', alignItems: 'center',
    padding: '1rem', borderRadius: '0.75rem',
    background: 'var(--bg-card)', border: '1px solid var(--color-border)'
  };

  const inputStyle = (hasError) => ({
    background: 'var(--bg-global)',
    border: `1px solid ${hasError ? '#ef4444' : 'var(--color-border)'}`,
    color: 'var(--color-text)',
    boxShadow: hasError ? '0 0 0 2px rgba(239,68,68,0.2)' : undefined
  });

  return (
    <>
      <SEO title={t('nav.contact')} description={t('contact.subtitle')} path="/contact" />

      <div className="space-y-12">
        {/* Title Block */}
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl font-display font-extrabold" style={{ color: 'var(--color-text)' }}>
            {t('contact.title')}
          </h1>
          <p className="text-lg" style={{ color: 'var(--color-muted)' }}>
            {t('contact.subtitle')}
          </p>
          <div className="h-1 w-20 rounded" style={{ background: 'linear-gradient(to right, var(--color-button), var(--color-accent))' }} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">

          {/* Contact Info Left */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold uppercase tracking-wider" style={{ color: 'var(--color-text)' }}>
              {t('contact.info_title')}
            </h2>

            <div className="space-y-4 text-sm font-semibold">
              {/* Mail */}
              <div style={infoCardStyle}>
                <Mail className="w-5 h-5 shrink-0" style={{ color: 'var(--color-button)' }} />
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: 'var(--color-muted)' }}>
                    {t('contact.email_label')}
                  </span>
                  <a href={`mailto:${store.personal.email}`} className="text-sm font-bold hover:underline" style={{ color: 'var(--color-text)' }}>
                    {store.personal.email}
                  </a>
                </div>
              </div>

              {/* LinkedIn */}
              <div style={infoCardStyle}>
                <Linkedin className="w-5 h-5 shrink-0" style={{ color: 'var(--color-accent)' }} />
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: 'var(--color-muted)' }}>
                    {t('contact.linkedin_label')}
                  </span>
                  <a href={store.personal.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm font-bold hover:underline" style={{ color: 'var(--color-text)' }}>
                    {store.personal.name}
                  </a>
                </div>
              </div>

              {/* Country */}
              <div style={infoCardStyle}>
                <MapPin className="w-5 h-5 shrink-0" style={{ color: 'var(--color-button)' }} />
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: 'var(--color-muted)' }}>
                    {t('contact.country_residence')}
                  </span>
                  <p className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>{store.personal.location}</p>
                </div>
              </div>

              {/* Work Mode */}
              <div style={infoCardStyle}>
                <Briefcase className="w-5 h-5 shrink-0" style={{ color: 'var(--color-accent)' }} />
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: 'var(--color-muted)' }}>
                    {t('contact.work_mode_label')}
                  </span>
                  <p className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>{t(store.personal.workModeKey)}</p>
                </div>
              </div>

              {/* Availability */}
              <div style={infoCardStyle}>
                <Calendar className="w-5 h-5 shrink-0 text-emerald-500" />
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest block" style={{ color: 'var(--color-muted)' }}>
                    {t('contact.availability_label')}
                  </span>
                  <p className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>{t(store.personal.availabilityKey)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Right */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form
                  key="contact-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit(onSubmit)}
                  className="glass-card p-6 md:p-8 rounded-2xl space-y-5"
                  aria-labelledby="form-heading"
                >
                  <h2 id="form-heading" className="text-xl font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text)' }}>
                    {t('contact.form_title')}
                  </h2>

                  {submitError && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm font-semibold">
                      {submitError}
                    </div>
                  )}

                  {/* Honeypot */}
                  <div className="hidden" aria-hidden="true">
                    <input type="text" name="honeypot" {...register('honeypot')} tabIndex={-1} autoComplete="off" />
                  </div>

                  {/* Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-xs font-bold" style={{ color: 'var(--color-text)' }}>
                      {t('contact.field_name')} <span className="text-red-500">*</span>
                    </label>
                    <input id="name" type="text" {...register('name')}
                      className={inputNormal} style={inputStyle(errors.name)}
                      aria-invalid={errors.name ? 'true' : 'false'}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                    />
                    {errors.name && <p id="name-error" className="text-xs text-red-500 font-semibold">{errors.name.message}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs font-bold" style={{ color: 'var(--color-text)' }}>
                      {t('contact.field_email')} <span className="text-red-500">*</span>
                    </label>
                    <input id="email" type="email" {...register('email')}
                      className={inputNormal} style={inputStyle(errors.email)}
                      aria-invalid={errors.email ? 'true' : 'false'}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                    {errors.email && <p id="email-error" className="text-xs text-red-500 font-semibold">{errors.email.message}</p>}
                  </div>

                  {/* Query Type */}
                  <div className="space-y-1.5">
                    <label htmlFor="queryType" className="text-xs font-bold" style={{ color: 'var(--color-text)' }}>
                      {t('contact.field_query_type')} <span className="text-red-500">*</span>
                    </label>
                    <select id="queryType" {...register('queryType')}
                      className={inputNormal} style={inputStyle(errors.queryType)}
                      aria-invalid={errors.queryType ? 'true' : 'false'}
                      aria-describedby={errors.queryType ? 'query-error' : undefined}
                    >
                      <option value="">{t('contact.query_placeholder')}</option>
                      <option value="recruitment">{t('contact.query_recruitment')}</option>
                      <option value="consulting">{t('contact.query_consulting')}</option>
                      <option value="project">{t('contact.query_project')}</option>
                      <option value="other">{t('contact.query_other')}</option>
                    </select>
                    {errors.queryType && <p id="query-error" className="text-xs text-red-500 font-semibold">{errors.queryType.message}</p>}
                  </div>

                  {/* Phone + Alt Contact */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="phone" className="text-xs font-bold" style={{ color: 'var(--color-text)' }}>
                        {t('contact.field_phone')}
                      </label>
                      <input id="phone" type="tel" {...register('phone')}
                        className={inputNormal} style={inputStyle(false)} />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="alternativeContact" className="text-xs font-bold" style={{ color: 'var(--color-text)' }}>
                        {t('contact.field_alt_contact')}
                      </label>
                      <input id="alternativeContact" type="text" {...register('alternativeContact')}
                        className={inputNormal} style={inputStyle(false)} />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label htmlFor="message" className="text-xs font-bold" style={{ color: 'var(--color-text)' }}>
                      {t('contact.field_message')} <span className="text-red-500">*</span>
                    </label>
                    <textarea id="message" rows={5} {...register('message')}
                      className={inputNormal} style={inputStyle(errors.message)}
                      aria-invalid={errors.message ? 'true' : 'false'}
                      aria-describedby={errors.message ? 'message-error' : undefined}
                    />
                    {errors.message && <p id="message-error" className="text-xs text-red-500 font-semibold">{errors.message.message}</p>}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 text-white font-bold rounded-lg shadow-lg hover:opacity-90 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center gap-2 cursor-pointer"
                    style={{ background: 'linear-gradient(to right, var(--color-button), var(--color-accent))' }}
                  >
                    <span>{isSubmitting ? t('cta.sending') : t('cta.send_message')}</span>
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card p-8 rounded-2xl text-center space-y-4"
                  style={{ border: '1px solid rgba(16,185,129,0.2)' }}
                >
                  <div className="flex justify-center">
                    <div className="p-4 bg-emerald-500/10 rounded-full text-emerald-500">
                      <CheckCircle className="w-12 h-12" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                    {t('contact.success_title')}
                  </h3>
                  <p className="text-sm max-w-sm mx-auto leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                    {t('contact.success_desc')}
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-2 font-bold text-xs rounded-lg shadow transition-opacity mt-2 hover:opacity-80"
                    style={{ background: 'var(--color-button)', color: '#fff' }}
                  >
                    {t('cta.close')}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
