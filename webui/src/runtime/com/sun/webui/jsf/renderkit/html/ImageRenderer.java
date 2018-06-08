/*
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS HEADER.
 *
 * Copyright (c) 2007-2018 Oracle and/or its affiliates. All rights reserved.
 *
 * The contents of this file are subject to the terms of either the GNU
 * General Public License Version 2 only ("GPL") or the Common Development
 * and Distribution License("CDDL") (collectively, the "License").  You
 * may not use this file except in compliance with the License.  You can
 * obtain a copy of the License at
 * https://oss.oracle.com/licenses/CDDL+GPL-1.1
 * or LICENSE.txt.  See the License for the specific
 * language governing permissions and limitations under the License.
 *
 * When distributing the software, include this License Header Notice in each
 * file and include the License file at LICENSE.txt.
 *
 * GPL Classpath Exception:
 * Oracle designates this particular file as subject to the "Classpath"
 * exception as provided by Oracle in the GPL Version 2 section of the License
 * file that accompanied this code.
 *
 * Modifications:
 * If applicable, add the following below the License Header, with the fields
 * enclosed by brackets [] replaced by your own identifying information:
 * "Portions Copyright [year] [name of copyright owner]"
 *
 * Contributor(s):
 * If you wish your version of this file to be governed by only the CDDL or
 * only the GPL Version 2, indicate your decision by adding "[Contributor]
 * elects to include this software in this distribution under the [CDDL or GPL
 * Version 2] license."  If you don't indicate a single choice of license, a
 * recipient has the option to distribute your version of this file under
 * either the CDDL, the GPL Version 2 or to extend the choice of license to
 * its licensees as provided above.  However, if you add GPL Version 2 code
 * and therefore, elected the GPL Version 2 license, then the option applies
 * only if the new code is made subject to such option by the copyright
 * holder.
 */

/*
 * ImageRenderer.java
 *
 * Created on November 16, 2004, 2:29 PM
 */
package com.sun.webui.jsf.renderkit.html;

import java.text.MessageFormat;
import com.sun.faces.annotation.Renderer;
import com.sun.webui.jsf.component.ImageComponent;
import com.sun.webui.jsf.component.Icon;
import com.sun.webui.theme.Theme;
import com.sun.webui.theme.ThemeImage;
import com.sun.webui.jsf.theme.ThemeImages;
import com.sun.webui.jsf.util.ClientSniffer;
import com.sun.webui.jsf.util.LogUtil;
import com.sun.webui.jsf.util.RenderingUtilities;
import com.sun.webui.jsf.util.ThemeUtilities;
import java.beans.Beans;
import java.io.IOException;
import javax.faces.context.FacesContext;
import javax.faces.context.ResponseWriter;
import javax.faces.component.UIComponent;

/**
 * Image renderer
 *
 * @author  Sean Comerford
 */
@Renderer(@Renderer.Renders(componentFamily = "com.sun.webui.jsf.Image"))
public class ImageRenderer extends AbstractRenderer {

    /**
     * <p>The set of integer pass-through attributes to be rendered.</p>
     */
    private static final String integerAttributes[] = {"border", //NOI18N
        "hspace", "vspace"}; //NOI18N
    /**
     * <p>The set of String pass-through attributes to be rendered.</p>
     */
    private static final String stringAttributes[] = {"align", //NOI18N
        "onClick", "onDblClick", //NO18N
        "onMouseDown", "onMouseMove", "onMouseOut", "onMouseOver"}; //NOI18N

    /** Creates a new instance of ImageRenderer */
    public ImageRenderer() {
        // default constructor
    }

    /**
     * Render the start of the image element
     *
     * @param context The current FacesContext
     * @param component The ImageComponent object to use
     * @param writer The current ResponseWriter
     *
     * @exception IOException if an input/output error occurss
     */
    @Override
    protected void renderStart(FacesContext context, UIComponent component,
            ResponseWriter writer) throws IOException {
        // render start of image
        ImageComponent image = (ImageComponent) component;
        writer.startElement("img", image);  //NOI18N
    }

    /**
     * Render the image element's attributes
     *
     * @param context The current FacesContext
     * @param component The ImageComponent object to use
     * @param writer The current ResponseWriter
     *
     * @exception IOException if an input/output error occurss
     */
    @Override
    protected void renderAttributes(FacesContext context, UIComponent component,
            ResponseWriter writer) throws IOException {
        // render image attrs
        ImageComponent image = (ImageComponent) component;

        String clientId = image.getClientId(context);
        if (clientId != null) {
            writer.writeAttribute("id", clientId, null);  //NOI18N
        }

        String url = image.getUrl();
        String icon = image.getIcon();
        String alt = image.getAlt();
        int height = image.getHeight();
        int width = image.getWidth();
        Theme theme = ThemeUtilities.getTheme(context);
        if (image instanceof Icon || (icon != null && url == null)) {
            // We just want some defaults if not specified by
            // the component, call Theme.getImage directly instead
            // of creating another component.
            //
            ThemeImage themeImage = theme.getImage(icon);
            url = themeImage.getPath();
            // height
            int dim = themeImage.getHeight();
            if (height < 0 && dim >= 0) {
                height = dim;
            }
            // width
            dim = themeImage.getWidth();
            if (width < 0 && dim >= 0) {
                width = dim;
            }

            // alt, Here if the developer wants "" render "".
            //
            String iconAlt = themeImage.getAlt();
            if (alt == null) {
                alt = iconAlt;
            }

        } else if (url == null) {
            if (!Beans.isDesignTime()) {
                // log an error
                if (LogUtil.warningEnabled(ImageRenderer.class)) {
                    LogUtil.warning(ImageRenderer.class, "  URL  was not " +
                            "specified and generally should be"); // NOI18N
                }
            }
        } else {
            url = context.getApplication().getViewHandler().getResourceURL(context, url);
        }

        // must encode the url (even though we call the function later)!
        url = (url != null && url.trim().length() != 0)
                ? context.getExternalContext().encodeResourceURL(url) : "";

        String style = image.getStyle();
        StringBuffer errorMsg = new StringBuffer("Image's {0} was not").append(" specified. Using a generic").append(" default value of {1}");
        MessageFormat mf = new MessageFormat(errorMsg.toString());
        if (isPngAndIE(context, url)) {

            String imgHeight = null;
            String imgWidth = null;

            if (width >= 0) {
                imgWidth = Integer.toString(width);
            } else {
                imgWidth = theme.getMessage("Image.defaultWidth");
                if (LogUtil.fineEnabled(ImageRenderer.class)) {
                    LogUtil.fine(ImageRenderer.class, mf.format(new String[]{"width", imgWidth}));  //NOI18N
                }
            }

            if (height >= 0) {
                imgHeight = Integer.toString(height);
            } else {
                imgHeight = theme.getMessage("Image.defaultHeight");
                if (LogUtil.fineEnabled(ImageRenderer.class)) {
                    LogUtil.fine(ImageRenderer.class, mf.format(new String[]{"height", imgHeight}));  //NOI18N
                }
            }
            String IEStyle = theme.getMessage("Image.IEPngCSSStyleQuirk",
                    new String[]{imgWidth, imgHeight, url});
            url = theme.getImagePath(ThemeImages.DOT);
            if (style == null) {
                style = IEStyle;
            } else {
                style = IEStyle + style;
            }
        }


        //write style class and style info
        RenderingUtilities.renderStyleClass(context, writer, image, null);
        if (style != null) {
            writer.writeAttribute("style", style, null); // NOI18N
        }

        RenderingUtilities.renderURLAttribute(context, writer, image, "src", //NO18N
                url, "url"); //NO18N

        // render alt
        if (alt != null) {
            writer.writeAttribute("alt", alt, null); // NOI18N
        } else {
            // alt is a required for XHTML compliance so output empty string
            // IS THIS ELSE NEEDED NOW THAT DESCRIPTION IS A REQUIRED PROPERTY?
            writer.writeAttribute("alt", "", null);  //NOI18N
        }

        // render the tooltip property as the image title attribute
        String toolTip = image.getToolTip();
        if (toolTip != null) {
            writer.writeAttribute("title", toolTip, null);   //NOI18N
        }

        // render the longDescription property as the image longdesc attribute
        String longDesc = image.getLongDesc();
        if (longDesc != null) {
            writer.writeAttribute("longdesc", longDesc, null); // NOI18N
        }

        // render height
        if (height >= 0) {
            writer.writeAttribute("height", Integer.toString(height), null); // NOI18N
        }

        // render width
        if (width >= 0) {
            writer.writeAttribute("width", Integer.toString(width), null); // NOI18N
        }

        addIntegerAttributes(context, component, writer, integerAttributes);
        addStringAttributes(context, component, writer, stringAttributes);
    }

    /**
     * Render the end of the image element
     *
     * @param context The current FacesContext
     * @param component The ImageComponent object to use
     * @param writer The current ResponseWriter
     *
     * @exception IOException if an input/output error occurss
     */
    @Override
    protected void renderEnd(FacesContext context, UIComponent component,
            ResponseWriter writer) throws IOException {
        // render end of image
        ImageComponent image = (ImageComponent) component;

        writer.endElement("img"); //NOI18N
    }

    private boolean isPngAndIE(FacesContext context, String url) {

        ClientSniffer cs = ClientSniffer.getInstance(context);

        //Some time encodeResourceURL(url) adds the sessiod to the
        // image URL, make sure to take that in to account
        //
        if (url.indexOf("sessionid") != -1) { //NOI18N
            if (url.substring(0, url.indexOf(';')).
                    endsWith(".png") && cs.isIe6up()) { //NOI18N
                return false;
            } else if (url.substring(0, url.indexOf(';')).
                    endsWith(".png") && cs.isIe5up()) { //NOI18N
                return true;
            }
        } else { //</RAVE>
            // IE 6 SP 2 and above seems to have fixed the problem with .png images
            // But not SP1. For things to work on IE6 one needs to upgrade to SP2.
            if (url.endsWith(".png")) {
                if (cs.isIe6up()) {
                    return false;
                } else if (cs.isIe5up()) {
                    return true;
                }
            }
        }

        return false;
    }
}
