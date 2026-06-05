import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import { Mail, Linkedin, MapPin, Briefcase, Calendar, CheckCircle } from 'lucide-react';
import SEO from '../components/SEO.jsx';

const Contact = () => {
  const { t } = useTranslation();
  const { store } = usePortfolio();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Zod Validation Schema
  const contactSchema = z.object({
    name: z.string().min(3, { message: t('contact.val_name_min') }),
    email: z.string().email({ message: t('contact.val_email_invalid') }),
    queryType: z.string().min(1, { message: t('contact.val_query_req') }),
    message: z.string().min(10, { message: t('contact.val_message_min') }),
    phone: z.string().optional(),
    alternativeContact: z.string().optional()
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      queryType: '',
      message: '',
      phone: '',
      alternativeContact: ''
    }
  });

  const onSubmit = (data) => {
    setIsSubmitting(true);
    // Simulate API request to backend/Vercel serverless function
    setTimeout(() => {
      console.log('Submitted contact payload:', data);
      setIsSubmitting(false);
      setIsSubmitted(true);
      reset();
    }, 1500);
  };

  return (
    <>
      <SEO 
        title={t('nav.contact')} 
        description={t('contact.subtitle')}
        path="/contact"
      />

      <div className="space-y-12">
        {/* Title Block */}
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl font-display font-extrabold text-brand-navy-900 dark:text-white">
            {t('contact.title')}
          </h1>
          <p className="text-lg text-brand-navy-600 dark:text-brand-ash-400">
            {t('contact.subtitle')}
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-brand-electric-500 to-brand-lilac-500 rounded" />
        </div>

        {/* Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          
          {/* Contact Details (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-brand-navy-900 dark:text-white uppercase tracking-wider">
              {t('contact.info_title')}
            </h2>

            <div className="space-y-4 text-sm font-semibold text-brand-navy-700 dark:text-brand-ash-300">
              {/* Mail */}
              <div className="flex gap-4 items-center p-4 bg-brand-ash-100/50 dark:bg-brand-navy-900/40 border border-brand-ash-200/50 dark:border-brand-navy-800/40 rounded-xl">
                <Mail className="w-5 h-5 text-brand-electric-500 shrink-0" />
                <div className="space-y-0.5">
                  <span className="text-xxs font-bold text-brand-navy-500 dark:text-brand-ash-400 uppercase tracking-widest block">
                    {t('contact.email_label')}
                  </span>
                  <a href={`mailto:${store.personal.email}`} className="text-sm font-bold text-brand-navy-950 dark:text-white hover:underline">
                    {store.personal.email}
                  </a>
                </div>
              </div>

              {/* LinkedIn */}
              <div className="flex gap-4 items-center p-4 bg-brand-ash-100/50 dark:bg-brand-navy-900/40 border border-brand-ash-200/50 dark:border-brand-navy-800/40 rounded-xl">
                <Linkedin className="w-5 h-5 text-brand-lilac-500 shrink-0" />
                <div className="space-y-0.5">
                  <span className="text-xxs font-bold text-brand-navy-500 dark:text-brand-ash-400 uppercase tracking-widest block">
                    {t('contact.linkedin_label')}
                  </span>
                  <a href={store.personal.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-brand-navy-950 dark:text-white hover:underline">
                    {store.personal.name}
                  </a>
                </div>
              </div>

              {/* Country */}
              <div className="flex gap-4 items-center p-4 bg-brand-ash-100/50 dark:bg-brand-navy-900/40 border border-brand-ash-200/50 dark:border-brand-navy-800/40 rounded-xl">
                <MapPin className="w-5 h-5 text-brand-electric-500 shrink-0" />
                <div className="space-y-0.5">
                  <span className="text-xxs font-bold text-brand-navy-500 dark:text-brand-ash-400 uppercase tracking-widest block">
                    {t('contact.country_residence')}
                  </span>
                  <p className="text-sm font-bold text-brand-navy-950 dark:text-white">
                    {store.personal.location}
                  </p>
                </div>
              </div>

              {/* Mode */}
              <div className="flex gap-4 items-center p-4 bg-brand-ash-100/50 dark:bg-brand-navy-900/40 border border-brand-ash-200/50 dark:border-brand-navy-800/40 rounded-xl">
                <Briefcase className="w-5 h-5 text-brand-lilac-500 shrink-0" />
                <div className="space-y-0.5">
                  <span className="text-xxs font-bold text-brand-navy-500 dark:text-brand-ash-400 uppercase tracking-widest block">
                    {t('contact.work_mode_label')}
                  </span>
                  <p className="text-sm font-bold text-brand-navy-950 dark:text-white">
                    {t(store.personal.workModeKey)}
                  </p>
                </div>
              </div>

              {/* Availability */}
              <div className="flex gap-4 items-center p-4 bg-brand-ash-100/50 dark:bg-brand-navy-900/40 border border-brand-ash-200/50 dark:border-brand-navy-800/40 rounded-xl">
                <Calendar className="w-5 h-5 text-emerald-500 shrink-0" />
                <div className="space-y-0.5">
                  <span className="text-xxs font-bold text-brand-navy-500 dark:text-brand-ash-400 uppercase tracking-widest block">
                    {t('contact.availability_label')}
                  </span>
                  <p className="text-sm font-bold text-brand-navy-950 dark:text-white">
                    {t(store.personal.availabilityKey)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Area (Right 3 cols) */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form
                  key="contact-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit(onSubmit)}
                  className="glass-card p-6 md:p-8 rounded-2xl space-y-5 border border-brand-ash-200 dark:border-brand-navy-800"
                  aria-labelledby="form-heading"
                >
                  <h2 id="form-heading" className="text-xl font-bold text-brand-navy-900 dark:text-white uppercase tracking-wider mb-2">
                    {t('contact.form_title')}
                  </h2>

                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-xs font-bold text-brand-navy-800 dark:text-brand-ash-300">
                      {t('contact.field_name')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      {...register('name')}
                      className={`w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-brand-navy-900 text-sm font-medium ${
                        errors.name
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-brand-ash-200 dark:border-brand-navy-800 focus:ring-brand-electric-500'
                      }`}
                      aria-invalid={errors.name ? "true" : "false"}
                      aria-describedby={errors.name ? "name-error" : undefined}
                    />
                    {errors.name && (
                      <p id="name-error" className="text-xs text-red-500 font-semibold">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Email field */}
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs font-bold text-brand-navy-800 dark:text-brand-ash-300">
                      {t('contact.field_email')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      {...register('email')}
                      className={`w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-brand-navy-900 text-sm font-medium ${
                        errors.email
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-brand-ash-200 dark:border-brand-navy-800 focus:ring-brand-electric-500'
                      }`}
                      aria-invalid={errors.email ? "true" : "false"}
                      aria-describedby={errors.email ? "email-error" : undefined}
                    />
                    {errors.email && (
                      <p id="email-error" className="text-xs text-red-500 font-semibold">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Query Type field */}
                  <div className="space-y-1.5">
                    <label htmlFor="queryType" className="text-xs font-bold text-brand-navy-800 dark:text-brand-ash-300">
                      {t('contact.field_query_type')} <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="queryType"
                      {...register('queryType')}
                      className={`w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-brand-navy-900 text-sm font-medium ${
                        errors.queryType
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-brand-ash-200 dark:border-brand-navy-800 focus:ring-brand-electric-500'
                      }`}
                      aria-invalid={errors.queryType ? "true" : "false"}
                      aria-describedby={errors.queryType ? "query-error" : undefined}
                    >
                      <option value="">{t('contact.query_placeholder')}</option>
                      <option value="recruitment">{t('contact.query_recruitment')}</option>
                      <option value="consulting">{t('contact.query_consulting')}</option>
                      <option value="project">{t('contact.query_project')}</option>
                      <option value="other">{t('contact.query_other')}</option>
                    </select>
                    {errors.queryType && (
                      <p id="query-error" className="text-xs text-red-500 font-semibold">{errors.queryType.message}</p>
                    )}
                  </div>

                  {/* Phone and Alternative Contact (Grid) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="phone" className="text-xs font-bold text-brand-navy-800 dark:text-brand-ash-300">
                        {t('contact.field_phone')}
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        {...register('phone')}
                        className="w-full px-4 py-2.5 rounded-lg border border-brand-ash-200 dark:border-brand-navy-800 bg-white dark:bg-brand-navy-900 text-sm font-medium focus:ring-brand-electric-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="alternativeContact" className="text-xs font-bold text-brand-navy-800 dark:text-brand-ash-300">
                        {t('contact.field_alt_contact')}
                      </label>
                      <input
                        id="alternativeContact"
                        type="text"
                        {...register('alternativeContact')}
                        className="w-full px-4 py-2.5 rounded-lg border border-brand-ash-200 dark:border-brand-navy-800 bg-white dark:bg-brand-navy-900 text-sm font-medium focus:ring-brand-electric-500"
                      />
                    </div>
                  </div>

                  {/* Message field */}
                  <div className="space-y-1.5">
                    <label htmlFor="message" className="text-xs font-bold text-brand-navy-800 dark:text-brand-ash-300">
                      {t('contact.field_message')} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      {...register('message')}
                      className={`w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-brand-navy-900 text-sm font-medium ${
                        errors.message
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-brand-ash-200 dark:border-brand-navy-800 focus:ring-brand-electric-500'
                      }`}
                      aria-invalid={errors.message ? "true" : "false"}
                      aria-describedby={errors.message ? "message-error" : undefined}
                    />
                    {errors.message && (
                      <p id="message-error" className="text-xs text-red-500 font-semibold">{errors.message.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 bg-gradient-to-r from-brand-navy-800 to-brand-navy-900 dark:from-brand-electric-500 dark:to-brand-electric-600 text-white font-bold rounded-lg shadow-lg hover:shadow-brand-electric-500/10 hover:opacity-95 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{isSubmitting ? t('cta.sending') : t('cta.send_message')}</span>
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card p-8 rounded-2xl border border-emerald-500/20 text-center space-y-4 glow-blue"
                >
                  <div className="flex justify-center">
                    <div className="p-4 bg-emerald-500/10 rounded-full text-emerald-500">
                      <CheckCircle className="w-12 h-12" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-brand-navy-900 dark:text-white">
                    {t('contact.success_title')}
                  </h3>
                  <p className="text-sm text-brand-navy-600 dark:text-brand-ash-400 max-w-sm mx-auto leading-relaxed">
                    {t('contact.success_desc')}
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-2 bg-brand-navy-800 text-white dark:bg-brand-navy-900 hover:opacity-90 font-bold text-xs rounded-lg shadow transition-opacity mt-2"
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
