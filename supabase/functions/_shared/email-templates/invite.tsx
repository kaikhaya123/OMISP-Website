/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface InviteEmailProps {
  siteName: string
  siteUrl: string
  confirmationUrl: string
}

const LOGO_URL = 'https://bzowlhsybhtvcyeucdnn.supabase.co/storage/v1/object/public/email-assets/omisp-logo.png'

export const InviteEmail = ({
  siteName,
  siteUrl,
  confirmationUrl,
}: InviteEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>You've been invited to OMISP</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <Img src={LOGO_URL} alt="OMISP" width="120" height="40" style={logo} />
        </Section>
        <Heading style={h1}>You're invited 🎉</Heading>
        <Text style={text}>
          Someone thinks you'd be a great fit for{' '}
          <Link href={siteUrl} style={link}>
            <strong>OMISP</strong>
          </Link>
          . Accept the invite to get started — it only takes a minute.
        </Text>
        <Section style={buttonSection}>
          <Button style={button} href={confirmationUrl}>
            Accept invitation
          </Button>
        </Section>
        <Text style={footer}>
          Not expecting this? You can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default InviteEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Inter', Arial, sans-serif" }
const container = { padding: '40px 32px', maxWidth: '480px', margin: '0 auto' }
const logoSection = { marginBottom: '32px' }
const logo = { display: 'block' as const }
const h1 = {
  fontSize: '24px',
  fontWeight: 'bold' as const,
  color: '#1f2937',
  margin: '0 0 16px',
  lineHeight: '1.3',
}
const text = {
  fontSize: '15px',
  color: '#6b7280',
  lineHeight: '1.6',
  margin: '0 0 20px',
}
const link = { color: '#f0a500', textDecoration: 'underline' }
const buttonSection = { margin: '28px 0' }
const button = {
  backgroundColor: '#f0a500',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: '600' as const,
  borderRadius: '12px',
  padding: '14px 28px',
  textDecoration: 'none',
}
const footer = { fontSize: '12px', color: '#9ca3af', margin: '32px 0 0', lineHeight: '1.5' }
