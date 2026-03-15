import { Card, Box, Typography, Avatar, Divider } from '@mui/material';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import RepeatIcon from '@mui/icons-material/Repeat';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';

const LI_BLUE = '#0a66c2';

export default function LinkedInPreview({ content, hashtags, charCount }) {
  const count = charCount ?? (content ? content.length : 0);

  return (
    <Card
      variant="outlined"
      sx={{ maxWidth: 550, borderRadius: '8px', p: 4 }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
        <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', width: 48, height: 48, fontWeight: 700 }}>
          SJ
        </Avatar>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Satvik Jain
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Senior PM at American Express
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            • 1d
          </Typography>
        </Box>
      </Box>

      {/* Content */}
      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
        {content}
      </Typography>

      {/* Hashtags */}
      {hashtags && hashtags.length > 0 && (
        <Typography variant="body2" sx={{ color: LI_BLUE, mb: 3 }}>
          {hashtags.map((t) => `#${t}`).join(' ')}
        </Typography>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Reactions bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-around', color: 'text.secondary' }}>
        <ThumbUpAltOutlinedIcon fontSize="small" />
        <ChatBubbleOutlineIcon fontSize="small" />
        <RepeatIcon fontSize="small" />
        <SendOutlinedIcon fontSize="small" />
      </Box>

      {/* Char count */}
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'right', mt: 2 }}>
        {count} characters
      </Typography>
    </Card>
  );
}
