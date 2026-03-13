/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface ReauthenticationEmailProps {
  token: string
}

const LOGO_URL = 'https://bzowlhsybhtvcyeucdnn.supabase.co/storage/v1/object/public/email-assets/omisp-logo.png'

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your OMISP verification code</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <Img src={LOGO_URL} alt="OMISP" width="120" height="40" style={logo} />
        </Section>
        <Heading style={h1}>Verify your identity</Heading>
        <Text style={text}>Use the code below to confirm it's you:</Text>
        <Text style={codeStyle}>{token}</Text>
        <Text style={footer}>
          This code expires shortly. Didn't request this? You can safely ignore it.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default ReauthenticationEmail

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
const codeStyle = {
  fontFamily: "'Courier New', Courier, monospace",
  fontSize: '28px',
  fontWeight: 'bold' as const,
  color: '#f0a500',
  margin: '0 0 30px',
  letterSpacing: '4px',
}
const footer = { fontSize: '12px', color: '#9ca3af', margin: '32px 0 0', lineHeight: '1.5' }
